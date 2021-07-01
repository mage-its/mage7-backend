const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, appDevService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const daftarAppDev = catchAsync(async (req, res) => {
  const { body, files, user } = req;
  await userService.checkEmailVerification(user.id);
  await userService.isRegistered(user.id);
  const [appDev] = await appDevService.daftarAppDev(body, files, user);
  res.status(httpStatus.CREATED).send({ appDev });
});

const updateProfile = catchAsync(async (req, res) => {
  const appDev = await appDevService.updateAppDevByUserId(req.user.id, req.body);
  res.send(appDev);
});

const createAppDev = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { body, files } = req;
  await userService.checkEmailVerification(userId);
  await userService.isRegistered(userId);
  const [appDev] = await appDevService.createAppDev(body, files, userId);
  res.status(httpStatus.CREATED).send({ appDev });
});

const getAppDevs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['statusBayar']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await appDevService.queryAppDevs(filter, options);
  res.send(result);
});

const getAppDev = catchAsync(async (req, res) => {
  const appDev = await appDevService.getAppDevById(req.params.appDevId);
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta application development tidak ditemukan');
  }
  res.send(appDev);
});

const updateAppDev = catchAsync(async (req, res) => {
  const appDev = await appDevService.updateAppDevById(req.params.appDevId, req.body);
  res.send(appDev);
});

const deleteAppDev = catchAsync(async (req, res) => {
  await appDevService.deleteAppDevById(req.params.appDevId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  daftarAppDev,
  updateProfile,
  createAppDev,
  getAppDevs,
  getAppDev,
  updateAppDev,
  deleteAppDev,
};
