const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { pengumumanService } = require('../services');

const createPengumuman = catchAsync(async (req, res) => {
  const pengumuman = await pengumumanService.createPengumuman(req.body);
  res.status(httpStatus.CREATED).send(pengumuman);
});

const getPengumumans = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await pengumumanService.queryPengumumans(filter, options);
  res.send(result);
});

module.exports = {
  createPengumuman,
  getPengumumans,
};
