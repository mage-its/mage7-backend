const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, olimService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const daftarOlim = catchAsync(async (req, res) => {
  await userService.checkEmailVerification(req.user.id);
  await userService.isRegistered(req.user.id);
  const olim = (await olimService.daftarOlim(req))[0];
  res.status(httpStatus.CREATED).send({ olim });
});

const getOlims = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['statusBayar']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await olimService.queryOlims(filter, options);
  res.send(result);
});

const getOlim = catchAsync(async (req, res) => {
  const olim = await olimService.getOlimById(req.params.olimId);
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta olimpiade tidak ditemukan');
  }
  res.send(olim);
});

const updateOlim = catchAsync(async (req, res) => {
  const olim = await olimService.updateOlimById(req.params.olimId, req.body);
  res.send(olim);
});

const deleteOlim = catchAsync(async (req, res) => {
  await olimService.deleteOlimById(req.params.olimId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  daftarOlim,
  getOlims,
  getOlim,
  updateOlim,
  deleteOlim,
};
