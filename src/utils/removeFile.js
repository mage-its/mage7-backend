const { promisify } = require('util');
const { unlink } = require('fs');

const unlinkAsync = promisify(unlink);

const removeFile = async (files) => {
  const cleanedKeys = Object.keys(files).filter((key) => {
    return files[key]?.[0]?.path;
  });
  const promises = cleanedKeys.map(async (key) => unlinkAsync(files[key][0].path));
  await Promise.all(promises);
};

const removeFilePaths = async (paths) => {
  const promises = paths.map(async (path) => unlinkAsync(path));
  await Promise.all(promises);
};

module.exports = {
  removeFile,
  removeFilePaths,
};
