const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { privateApp } = require('./private');
const { apiApp } = require('./api');

admin.initializeApp();

exports.private = functions.https.onRequest(privateApp);
exports.api = functions.https.onRequest(apiApp);

