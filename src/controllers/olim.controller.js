const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, olimService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const daftarOlim = catchAsync(async (req, res) => {
  const { body, files, user } = req;
  await userService.checkEmailVerification(user.id);
  await userService.isRegistered(user.id);
  const [olim] = await olimService.daftarOlim(body, files, user);
  res.status(httpStatus.CREATED).send({ olim });
});

const updateProfile = catchAsync(async (req, res) => {
  const olim = await olimService.updateOlimByUserId(req.user.id, req.body);
  res.send(olim);
});

const createOlim = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { body, files } = req;
  await userService.checkEmailVerification(userId);
  await userService.isRegistered(userId);
  const [olim] = await olimService.createOlim(body, files, userId);
  res.status(httpStatus.CREATED).send({ olim });
});

const getOlims = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isVerified']);
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

const toggleVerif = catchAsync(async (req, res) => {
  const olim = await olimService.toggleVerif(req.params.olimId);
  res.send(olim);
});

module.exports = {
  daftarOlim,
  updateProfile,
  createOlim,
  getOlims,
  getOlim,
  updateOlim,
  deleteOlim,
  toggleVerif,
};
