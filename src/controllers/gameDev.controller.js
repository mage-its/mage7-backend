const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, gameDevService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const daftarGameDev = catchAsync(async (req, res) => {
  const { body, files, user } = req;
  await userService.checkEmailVerification(user.id);
  await userService.isRegistered(user.id);
  const [gameDev] = await gameDevService.daftarGameDev(body, files, user);
  res.status(httpStatus.CREATED).send({ gameDev });
});

const updateProfile = catchAsync(async (req, res) => {
  const gameDev = await gameDevService.updateGameDevByUserId(req.user.id, req.body);
  res.send(gameDev);
});

const uploadProposal = catchAsync(async (req, res) => {
  const gameDev = await gameDevService.uploadProposal(req.user.id, req.files);
  res.send(gameDev);
});

const createGameDev = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { body, files } = req;
  await userService.checkEmailVerification(userId);
  await userService.isRegistered(userId);
  const [gameDev] = await gameDevService.createGameDev(body, files, userId);
  res.status(httpStatus.CREATED).send({ gameDev });
});

const getGameDevs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['statusBayar']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await gameDevService.queryGameDevs(filter, options);
  res.send(result);
});

const getGameDev = catchAsync(async (req, res) => {
  const gameDev = await gameDevService.getGameDevById(req.params.gameDevId);
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta game development tidak ditemukan');
  }
  res.send(gameDev);
});

const updateGameDev = catchAsync(async (req, res) => {
  const gameDev = await gameDevService.updateGameDevById(req.params.gameDevId, req.body);
  res.send(gameDev);
});

const deleteGameDev = catchAsync(async (req, res) => {
  await gameDevService.deleteGameDevById(req.params.gameDevId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  daftarGameDev,
  updateProfile,
  uploadProposal,
  createGameDev,
  getGameDevs,
  getGameDev,
  updateGameDev,
  deleteGameDev,
};
