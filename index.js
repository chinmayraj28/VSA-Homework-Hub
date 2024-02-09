const cors = require('cors')
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const route = express.Router();
const bodyParser = require('body-parser')
const fb = require('./handlers/firebase/firebase.js')
const port = 3000
const util = require('./handlers/main/utils.js')
const delay = ms => new Promise(res => setTimeout(res, ms));
const Queue = require('./handlers/main/queue.js')

//MiddleWares
async function isAdminAuthorized(req, res, next) {
  const dbContent = await util.getUsers(fb)
  const { username, password } = req.query; 
  let idx;
  
  if (username && password) {
    for (let i = 0; i < dbContent.length; i++){
      if (dbContent[i].username === username) {
        idx = i;
        break;
      }
    }
  }

  if (idx !== undefined && dbContent[idx].password === password) {
    if (dbContent[idx].role === "1") {  
      req.isNormalAdmin = true;  
    } else {
      req.isNormalAdmin = false; 
    }
    next();
  }else{
    const arrayOfClasses = await util.getClasses(fb)
    res.render('pages/404', {
      classArray: arrayOfClasses
    });
  }
}

function ignoreFavicon(req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }
 next();
}

//App config
app.use(ignoreFavicon);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('views'));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Bad request. Invalid JSON.' });
  } else {
    next();
  }
});

app.get('/', async (req, res) => {
  try {
    const classes = await util.getClasses(fb);
    res.render('pages/home', { classArray: classes });
  } catch (error) {
    //console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/admin', isAdminAuthorized, async (req, res) => {
  const arrayOfClasses = await util.getClasses(fb)
  const userDetails = await util.getUsers(fb)
  
  if(req.isNormalAdmin){
    res.render('pages/admin', {
      classArray: arrayOfClasses,
      authorizedUsers: userDetails,
    });
  }else{
    res.render('pages/masteradmin', {
      classArray: arrayOfClasses,
      authorizedUsers: userDetails,
    });
  }


});

app.post('/submit', async (req, res) => {
  const data = req.body;
  const path = fb.ref(`classes/${data.class}/${data.subject}/${data.date}`);

  const snapshot = await path.once('value');
  const existingData = snapshot.val();

  if (existingData) {
    if (Array.isArray(existingData)) {
      existingData.push(data.assignment);
      await path.set(existingData);
      res.sendStatus(200);
    } else {
      await path.set([existingData, data.assignment]);
      res.sendStatus(200);
    }
  } else {
    await path.set([data.assignment]);
    res.sendStatus(200);
  }

});

app.post('/deleteuser', async (req, res) => {
  try {
    const data = req.body;
    const path = fb.ref(`users`);
    const snapshot = await path.once('value');
    const existingData = snapshot.val();

    for (let i = 0; i < existingData.length; i++) {
      if (existingData[i].username === data.username) {
        existingData.splice(i, 1);
        break;
      }
    }

    await path.set(existingData);

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post('/adduser', async (req, res) => {
  try {
    const data = req.body;
    let path = fb.ref('/users')

    const snapshot = await path.once('value');
    const existingData = snapshot.val();
    if(existingData){
      if(Array.isArray(existingData)){
        existingData.push(data)
        await path.set(existingData)
      }else{
        await path.set([existingData, data])
      }
    }else{
      await path.set([data])
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding user:", error);
    res.sendStatus(500);
  }
})


app.get('/:className', async (req, res) => {
  const { className } = req.params;
  let arrayOfClasses = await util.getClasses(fb)

  try {
    const subjects = await util.getSubjects(fb, className);
    let emptyArray = new Array(subjects.length);
    const subjectInfo = await util.getSubjectsInfo(fb)
    for (let i = 0; i < subjectInfo.length; i++){
      for (let j = 0; j < subjects.length; j++){
        if (subjectInfo[i].subject === subjects[j]){
          emptyArray[j] = subjectInfo[i]
        }
      }
    }

    res.render('pages/classPaths', {
      fb: fb,
      className: className,
      classArray: arrayOfClasses,
      subjects: subjects,
      subjectsWithInfo: emptyArray
    });
  } catch (error) {
    res.render('pages/404', {
      classArray: arrayOfClasses
    });
  }
});

app.get('/:className/:subjectName', async (req, res) => {
  const { className, subjectName } = req.params;
  const arrayOfClasses = await util.getClasses(fb)
  
  try {
    const dates = await util.getDates(fb, className, subjectName);

    res.render('pages/subjectPaths', {
      fb: fb,
      className: className,
      classArray: arrayOfClasses,
      subjectName: subjectName,
      dates: dates
    });
  } catch (error) {
    //console.log(error)
    res.render('pages/404', {
      classArray: arrayOfClasses
    });
  }
});

app.get('/:className/:subjectName/:dateName', async (req, res) => {
  const { className, subjectName, dateName } = req.params;
  const arrayOfClasses = await util.getClasses(fb)

  try {
    const assignments = await util.getAssignments(fb, className, subjectName, dateName);
    res.render('pages/datePaths', {
      fb: fb,
      className: className,
      subjectName: subjectName,
      dateName: dateName,
      assignments: assignments,
      classArray: arrayOfClasses,
      date: dateName
    });
  } catch (error) {
    //console.log(error)
    res.render('pages/404', {
      classArray: arrayOfClasses
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.\nhttp://localhost:${port}`);
});
