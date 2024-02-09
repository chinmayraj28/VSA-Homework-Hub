// Firebase Realtime Database
const admin = require('firebase-admin')
var serviceAccount = require("./.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "firebasedatabase.app"
});

let fb = admin.database();

module.exports = fb
