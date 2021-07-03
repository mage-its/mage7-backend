const { access, unlink } = require('fs/promises');
const { constants } = require('fs');

const filterExistPaths = async (paths) => {
  const res = await Promise.all(
    paths.map(async (path) => {
      try {
        // eslint-disable-next-line no-bitwise
        await access(path, constants.F_OK | constants.W_OK);
        return true && path;
      } catch (e) {
        return false;
      }
    })
  );
  return paths.filter((_, i) => res[i]);
};

const removeFilePaths = async (paths) => {
  const existPaths = await filterExistPaths(paths);
  const promises = existPaths.map(async (path) => unlink(path));
  await Promise.all(promises);
};

const removeFile = async (files) => {
  const cleanedKeys = Object.keys(files).filter((key) => files[key]?.[0]?.path);
  const paths = cleanedKeys.map((key) => files[key][0].path);
  await removeFilePaths(paths);
};

module.exports = {
  removeFile,
  removeFilePaths,
};
