const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');

const pay = catchAsync(async (req, res) => {
  const compe = await paymentService.pay(req.user.id, req.body.namaBayar, req.files);
  res.send(compe);
});

module.exports = {
  pay,
};
