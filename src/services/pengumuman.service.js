const httpStatus = require('http-status');
const { Pengumuman } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a pengumuman
 * @param {Object} pengumumanBody
 * @returns {Promise<Pengumuman>}
 */
const createPengumuman = async (pengumumanBody) => {
  const pengumuman = await Pengumuman.create(pengumumanBody);
  return pengumuman;
};

/**
 * Query for pengumumans
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPengumumans = async (filter, options) => {
  const pengumumans = await Pengumuman.paginate(filter, options);
  return pengumumans;
};

const getPengumumanByType = async (type) => {
  const pengumuman = await Pengumuman.findOne({ type });
  if (!pengumuman) {
    throw new ApiError(httpStatus.NOT_FOUND, `Pengumuman dengan tipe ${type} tidak ditemukan`);
  }
  return pengumuman;
};

module.exports = {
  createPengumuman,
  queryPengumumans,
  getPengumumanByType,
};
