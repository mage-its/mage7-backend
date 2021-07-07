const { removeFile } = require('../utils/removeFile');

const cancelFileUpload = () => async (err, req, res, next) => {
  if (req.files) {
    console.log(req.files);
    await removeFile(req.files);
  }
  next(err);
};

module.exports = cancelFileUpload;
