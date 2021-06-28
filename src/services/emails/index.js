const fs = require('fs');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const verifyMailHtml = fs.readFileSync(path.join(__dirname, '/verification.html')).toString();

const getVerMailHtml = (link) => {
  return verifyMailHtml.replace(/{{link}}/g, link);
};

module.exports.getVerMailHtml = getVerMailHtml;
