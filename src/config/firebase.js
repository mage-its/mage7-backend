const admin = require('firebase-admin');
// eslint-disable-next-line import/no-unresolved
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
