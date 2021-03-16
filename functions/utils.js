const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');


function getRecordByKeyValue(collection, key, value) {
  return admin.firestore().collection(collection)
    .where(key, "==", value)
    .limit(1)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size < 1) {
        return null;
      }

      const doc = querySnapshot.docs[0];

      return { id: doc.id, ...doc.data() };
    });
}

function checkToken(token, apiKey) {
  return getRecordByKeyValue("apiKeys", "key", apiKey).then(
    apiKeyData => {
      if (!token || !apiKeyData) return 'token-or-key-missing';

      const { secret } = apiKeyData;
      try {
        jwt.verify(token, secret);
      } catch(error) {
        return 'token-invalid';
      }
      return 'token-valid';
    }
  )
}

exports.getRecordByKeyValue = getRecordByKeyValue;
exports.checkToken = checkToken;
