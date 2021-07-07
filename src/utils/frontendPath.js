const frontendPath = (path, num = 4) => path.split('/').splice(-num).join('/');

module.exports = frontendPath;
