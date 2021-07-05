const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, iotDevService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const daftarIotDev = catchAsync(async (req, res) => {
  const { body, files, user } = req;
  await userService.checkEmailVerification(user.id);
  await userService.isRegistered(user.id);
  const [iotDev] = await iotDevService.daftarIotDev(body, files, user);
  res.status(httpStatus.CREATED).send({ iotDev });
});

const updateProfile = catchAsync(async (req, res) => {
  const iotDev = await iotDevService.updateIotDevByUserId(req.user.id, req.body);
  res.send(iotDev);
});

const uploadProposal = catchAsync(async (req, res) => {
  const iotDev = await iotDevService.uploadProposal(req.user.id, req.files);
  res.send(iotDev);
});

const createIotDev = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { body, files } = req;
  await userService.checkEmailVerification(userId);
  await userService.isRegistered(userId);
  const [iotDev] = await iotDevService.createIotDev(body, files, userId);
  res.status(httpStatus.CREATED).send({ iotDev });
});

const getIotDevs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['statusBayar']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await iotDevService.queryIotDevs(filter, options);
  res.send(result);
});

const getIotDev = catchAsync(async (req, res) => {
  const iotDev = await iotDevService.getIotDevById(req.params.iotDevId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta IOT development tidak ditemukan');
  }
  res.send(iotDev);
});

const updateIotDev = catchAsync(async (req, res) => {
  const iotDev = await iotDevService.updateIotDevById(req.params.iotDevId, req.body);
  res.send(iotDev);
});

const deleteIotDev = catchAsync(async (req, res) => {
  await iotDevService.deleteIotDevById(req.params.iotDevId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  daftarIotDev,
  updateProfile,
  uploadProposal,
  createIotDev,
  getIotDevs,
  getIotDev,
  updateIotDev,
  deleteIotDev,
};
