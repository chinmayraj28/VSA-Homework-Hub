// Firebase Realtime Database
const admin = require('firebase-admin')
var serviceAccount = require("./vsa-homework-firebase-adminsdk-zlqau-10a7db19a2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vsa-homework-default-rtdb.asia-southeast1.firebasedatabase.app"
});

let fb = admin.database();

module.exports = fb