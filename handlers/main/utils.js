module.exports = {

    getUsers: async function (db) {
        let path = db.ref(`users`);
        return new Promise((resolve, reject) => {
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    reject(new Error('Invalid')); 
                    return; 
                }
                    resolve(snapshot.val());
                });
        });
    },

    getSubjectsInfo: async function (db) {
        let path = db.ref(`subjects`);
        return new Promise((resolve, reject) => {
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    reject(new Error('Invalid')); 
                    return; 
                }
                    let subjectsInfo = snapshot.val()
                    resolve(subjectsInfo);
                });
            });
    },

    getSubjects: async function (db, className) {
        let path = db.ref(`classes/${className}`);
        return new Promise((resolve, reject) => {
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    reject(new Error('Invalid')); 
                    return; 
                }
                    let arrayOfSubjects = Object.keys(snapshot.val());
                    resolve(arrayOfSubjects);
                });
            });
    },

    getDates: async function(db, className, subject){
        let path = db.ref(`classes/${className}/${subject}`)
        return new Promise((resolve, reject) => {
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    reject(new Error('Invalid')); 
                    return; 
                }
                let arrayOfDates = Object.keys(snapshot.val())
                resolve(arrayOfDates)
            })
        });
    },

    getAssignments: async function (db, className, subject, date) {
        let path = db.ref(`classes/${className}/${subject}/${date}`)
        return new Promise((resolve, reject) => {
                path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    reject(new Error('Invalid')); 
                    return; 
                }
                resolve(snapshot.val())
            })
        });
    },

    getClasses: async function (db){
        let path = db.ref('classes')
        return new Promise((resolve, reject) => {
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    reject(new Error('Invalid')); 
                    return; 
                }
                let arrayOfSubjects = Object.keys(snapshot.val());
                resolve(arrayOfSubjects);
            });
        });
    }

};