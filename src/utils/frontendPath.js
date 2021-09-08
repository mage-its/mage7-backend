/**
 * Trim path to frontend path
 * @param {string} path
 * @param {number} [num=4]
 * @returns {string}
 */
const frontendPath = (path, num = 4) => path.split('/').splice(-num).join('/');

module.exports = frontendPath;
