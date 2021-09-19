const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getProfile = catchAsync(async (req, res) => {
  const result = await userService.getProfile(req.user.id);
  res.send(result);
});

const getProfileByCompeId = catchAsync(async (req, res) => {
  const result = await userService.getProfileByCompeId(req.params.compeId);
  res.send(result);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'registeredComp']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const downloadCsv = catchAsync(async (req, res) => {
  const csv = await userService.downloadCsv();
  res.header('Content-Type', 'text/csv');
  res.attachment(`users.csv`);
  res.send(csv);
});

module.exports = {
  createUser,
  getProfile,
  getProfileByCompeId,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  downloadCsv,
};
