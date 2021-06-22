const { promisify } = require('util');
const { unlink } = require('fs');

const unlinkAsync = promisify(unlink);

const cancelFileUpload = () => async (err, req, res, next) => {
  if (req.files) {
    const { files } = req;
    const promises = Object.keys(files).map((key) => {
      return unlinkAsync(files[key][0].path).then(() => {});
    });
    Promise.all(promises).then(() => {});
  }
  next(err);
};

module.exports = cancelFileUpload;
