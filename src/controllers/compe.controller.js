const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { compeService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const pay = catchAsync(async (req, res) => {
  const compe = await compeService.pay(req.user.id, req.body.namaBayar, req.files);
  res.send(compe);
});

const toggleVerif = catchAsync(async (req, res) => {
  const compe = await compeService.toggleVerif(req.params.compeId);
  res.send(compe);
});

const getCompetitions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isVerified']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await compeService.queryCompetitions(filter, options);
  res.send(result);
});

const getCompetition = catchAsync(async (req, res) => {
  const [compe] = await compeService.getCompeById(req.params.compeId);
  if (!compe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta competition tidak ditemukan');
  }
  res.send(compe);
});

module.exports = {
  pay,
  toggleVerif,
  getCompetitions,
  getCompetition,
};
