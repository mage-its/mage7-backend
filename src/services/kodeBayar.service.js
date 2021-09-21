const httpStatus = require('http-status');
const { KodeBayar } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a kodeBayar
 * @param {Object} kodeBayarBody
 * @returns {Promise<KodeBayar>}
 */
const createKodeBayar = async (kodeBayarBody) => {
  return KodeBayar.create(kodeBayarBody);
};

/**
 * Query for kodebayars
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryKodeBayars = async (filter, options) => {
  const kodeBayars = await KodeBayar.paginate(filter, options);
  return kodeBayars;
};

const getKodeBayarByCabang = async (cabang) => {
  const kodeBayar = await KodeBayar.findOne({ name: cabang });
  if (!kodeBayar) {
    throw new ApiError(httpStatus.NOT_FOUND, `Kode bayar dengan cabang ${cabang} tidak ditemukan`);
  }
  return kodeBayar;
};

const updateKodeBayar = async (cabang, updateBody) => {
  const kodeBayar = await getKodeBayarByCabang(cabang);
  if (!kodeBayar) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Bayar not found');
  }
  Object.assign(kodeBayar, updateBody);
  await kodeBayar.save();
  return kodeBayar;
};

const getNoUrut = async (cabang) => {
  const kodeBayar = await getKodeBayarByCabang(cabang);
  return kodeBayar.no;
};

const incNoUrut = async (cabang, kodeBayarObj) => {
  const kodeBayar = kodeBayarObj || (await getKodeBayarByCabang(cabang));
  if (!kodeBayar) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Bayar not found');
  }
  kodeBayar.no += 1;
  await kodeBayar.save();
  return kodeBayar;
};

module.exports = {
  createKodeBayar,
  queryKodeBayars,
  getKodeBayarByCabang,
  getNoUrut,
  incNoUrut,
  updateKodeBayar,
};
