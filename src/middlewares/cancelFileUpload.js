const { promisify } = require('util');
const { unlink } = require('fs');

const unlinkAsync = promisify(unlink);

const cancelFileUpload = () => async (err, req, res, next) => {
  if (req.files) {
    const { files } = req;
    const cleanedKeys = Object.keys(files).filter((key) => {
      return files[key]?.[0]?.path;
    });
    const promises = cleanedKeys.map(async (key) => unlinkAsync(files[key][0].path));
    await Promise.all(promises);
  }
  next(err);
};

module.exports = cancelFileUpload;
