const { readFileSync } = require('fs');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const verifyMailHtml = readFileSync(path.join(__dirname, '/verification.html')).toString();

// eslint-disable-next-line security/detect-non-literal-fs-filename
const resetPassHtml = readFileSync(path.join(__dirname, '/resetPassword.html')).toString();

const getVerMailHtml = (link) => {
  return verifyMailHtml.replace(/{{link}}/g, link);
};

const getResetPassHtml = (link) => {
  return resetPassHtml.replace(/{{link}}/g, link);
};

module.exports = {
  getVerMailHtml,
  getResetPassHtml,
};
