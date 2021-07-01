const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
<<<<<<< HEAD
const olimService = require('./olim.service');
=======
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
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

<<<<<<< HEAD
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

=======
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2
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
<<<<<<< HEAD
  switch (user.registeredComp) {
    case 'olim': {
      const olim = await olimService.getOlimByUserId(user.id);
      if (olim) {
        await olimService.deleteOlimById(olim.id, olim, user);
      }
      break;
    }
    default:
      break;
  }
=======
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
<<<<<<< HEAD
  checkEmailVerification,
  isRegistered,
=======
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2
};
