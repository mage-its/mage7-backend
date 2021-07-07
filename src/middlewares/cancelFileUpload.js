const { removeFile } = require('../utils/removeFile');

const cancelFileUpload = () => async (err, req, res, next) => {
  if (req.files) {
    await removeFile(req.files);
  }
  next(err);
};

module.exports = cancelFileUpload;
