const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { kodeBayarService } = require('../services');

const createKodeBayar = catchAsync(async (req, res) => {
  const kodeBayar = await kodeBayarService.createKodeBayar(req.body);
  res.status(httpStatus.CREATED).send(kodeBayar);
});

module.exports = {
  createKodeBayar,
};
