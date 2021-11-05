const httpStatus = require('http-status');
const config = require('../config/config');

const submitKaryaBarrier = () => (req, res, next) => {
  if (config.close.submitKarya) {
    res.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: `Pengumpulan karya sudah ditutup`,
    });
  } else next();
};

module.exports = submitKaryaBarrier;
