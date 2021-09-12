const httpStatus = require('http-status');
const config = require('../config/config');

const registerBarrier = (category) => (req, res, next) => {
  if (config.closeReg[category]) {
    res.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: `Registrasi ${category} sudah ditutup`,
    });
  } else next();
};

module.exports = registerBarrier;
