var admin = require("firebase-admin");
const { v4: uuidv4 } = require('uuid');

// var serviceAccount = require("/Users/simonhildebrandt/Downloads/login-with-link-staging-firebase-adminsdk-u3ggs-69443c2341.json");
var serviceAccount = require("/Users/simonhildebrandt/Downloads/login-with-link-firebase-adminsdk-co5u1-cf0b05b8a9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const data = admin.firestore().collection('apiKeys').get().then(snapshot => {
  snapshot.forEach(doc => {
    console.log(doc.data());
    if (!doc.data().exchangeSecret) {
      console.log('updating', doc.id);
      doc.ref.update({exchangeSecret: uuidv4()});
    }
  });
});
