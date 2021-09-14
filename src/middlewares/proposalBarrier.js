const httpStatus = require('http-status');
const config = require('../config/config');

const proposalBarrier = () => (req, res, next) => {
  if (config.close.proposal) {
    res.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: `Pengumpulan proposal sudah ditutup`,
    });
  } else next();
};

module.exports = proposalBarrier;
