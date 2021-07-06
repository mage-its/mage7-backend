const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const olimService = require('./olim.service');
const appDevService = require('./appDev.service');
const gameDevService = require('./gameDev.service');
const iotDevService = require('./iotDev.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const checkEmailVerification = async (userId) => {
  const verifiedUser = await User.findOne({ _id: userId, isEmailVerified: true });
  if (!verifiedUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email not verified');
  }
};

const isRegistered = async (userId) => {
  if (!(await User.findOne({ _id: userId, registeredComp: '' }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User sudah terdaftar di salah satu cabang');
  }
};

const getProfile = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  let compe = {};
  switch (user.registeredComp) {
    case 'olim':
      compe = await olimService.getOlimByUserId(userId);
      break;
    case 'gamedev':
      compe = await gameDevService.getGameDevByUserId(userId);
      break;
    case 'appdev':
      compe = await appDevService.getAppDevByUserId(userId);
      break;
    case 'iotdev':
      compe = await iotDevService.getIotDevByUserId(userId);
      break;
    default:
      break;
  }
  return { user, compe };
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  switch (user.registeredComp) {
    case 'olim': {
      const olim = await olimService.getOlimByUserId(user.id);
      if (olim) {
        await olimService.deleteOlimById(olim.id, olim, user);
      }
      break;
    }
    case 'gamedev': {
      const gameDev = await gameDevService.getGameDevByUserId(user.id);
      if (gameDev) {
        await gameDevService.deleteGameDevById(gameDev.id, gameDev, user);
      }
      break;
    }
    case 'appdev': {
      const appDev = await appDevService.getAppDevByUserId(user.id);
      if (appDev) {
        await appDevService.deleteAppDevById(appDev.id, appDev, user);
      }
      break;
    }
    case 'iotdev': {
      const iotDev = await iotDevService.getIotDevByUserId(user.id);
      if (iotDev) {
        await iotDevService.deleteIotDevById(iotDev.id, iotDev, user);
      }
      break;
    }
    default:
      break;
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  getProfile,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  checkEmailVerification,
  isRegistered,
};
