const admin = require('firebase-admin');
const config = require('./config');
// eslint-disable-next-line import/no-unresolved
const serviceAccount = config.env !== 'ci' ? require('../../serviceAccountKey.json') : '';

if (config.env !== 'ci') {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
