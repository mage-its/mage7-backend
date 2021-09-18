const httpStatus = require('http-status');
const config = require('../config/config');

const cat = {
  olim: 'paymentOlim',
};

const paymentBarrier = () => (req, res, next) => {
  if (config.close[cat[req?.user?.registeredComp]]) {
    res.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: `Pembayaran ${req.user.registeredComp === 'olim' ? 'Olimpiade' : 'Development Competition'} sudah ditutup`,
    });
  } else next();
};

module.exports = paymentBarrier;
