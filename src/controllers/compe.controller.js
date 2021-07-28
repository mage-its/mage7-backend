const catchAsync = require('../utils/catchAsync');
const { compeService } = require('../services');

const pay = catchAsync(async (req, res) => {
  const compe = await compeService.pay(req.user.id, req.body.namaBayar, req.files);
  res.send(compe);
});

const toggleVerif = catchAsync(async (req, res) => {
  const compe = await compeService.toggleVerif(req.params.userId);
  res.send(compe);
});

module.exports = {
  pay,
  toggleVerif,
};
