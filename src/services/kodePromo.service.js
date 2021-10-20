const httpStatus = require('http-status');
const { trusted } = require('mongoose');
const { KodePromo } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a kodePromo
 * @param {Object} kodePromoBody
 * @returns {Promise<KodePromo>}
 */
const createKodePromo = async (kodePromoBody) => {
  return KodePromo.create(kodePromoBody);
};

/**
 * Query for kodepromos
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryKodePromos = async (filter, options) => {
  const kodePromos = await KodePromo.paginate(filter, options);
  return kodePromos;
};

/**
 * Get a kodePromo
 * @param {ObjectId} id
 * @returns {Promise<KodePromo>}
 */
const getKodePromoById = async (id) => {
  return KodePromo.findById(id);
};

/**
 * Get a kodePromo by kode
 * @param {string} kode
 * @param {string} category
 * @returns {Promise<KodePromo>}
 */
const getKodePromoByKode = async (kode, category) => {
  const kodePromo = await KodePromo.findOne({ kode, category });
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, `Kode promo dengan kode ${kode} tidak ditemukan`);
  }
  return kodePromo;
};

/**
 * Update a kodePromo by kode
 * @param {string} kode
 * @param {Object} updateBody
 * @returns {Promise<KodePromo>}
 */
const updateKodePromoByKode = async (kode, updateBody) => {
  const kodePromo = await getKodePromoByKode(kode);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  Object.assign(kodePromo, updateBody);
  await kodePromo.save();
  return kodePromo;
};

/**
 * Update a kodePromo by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<KodePromo>}
 */
const updateKodePromoById = async (id, updateBody) => {
  const kodePromo = await getKodePromoById(id);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  Object.assign(kodePromo, updateBody);
  await kodePromo.save();
  return kodePromo;
};

/**
 * Delete a kodePromo by kode
 * @param {string} kode
 * @returns {Promise<KodePromo>}
 */
const deleteKodePromoByKode = async (kode) => {
  const kodePromo = await getKodePromoByKode(kode);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  await kodePromo.remove();
  return kodePromo;
};

/**
 * Delete a kodePromo by id
 * @param {ObjectId} id
 * @returns {Promise<KodePromo>}
 */
const deleteKodePromoById = async (id) => {
  const kodePromo = await getKodePromoById(id);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  await kodePromo.remove();
  return kodePromo;
};

/**
 * Toggle a kodePromo by id
 * @param {string} id
 * @returns {Promise<KodePromo>}
 */
const toggleActive = async (id) => {
  const kodePromo = await getKodePromoById(id);
  kodePromo.active = !kodePromo.active;
  return kodePromo.save();
};

const kodePromoType = {
  olim: { $in: ['olim', 'all'] },
  appdev: { $in: ['devcom', 'all'] },
  gamedev: { $in: ['devcom', 'all'] },
  iotdev: { $in: ['devcom', 'all'] },
};

/**
 * Apply a kodePromo
 * @param {string} kode
 * @param {User} user
 * @param {Object} compe
 * @returns {Promise<Olim|GameDev|AppDev|IotDev>}
 */
const applyPromo = async (kode, user, compe) => {
  if (!user.registeredComp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User belum mendaftar');
  }
  const kodePromo = await getKodePromoByKode(kode, trusted(kodePromoType[user.registeredComp]));
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode promo tidak ditemukan!');
  }
  if (kodePromo.category !== 'all') {
    if (kodePromo.category === 'olim' && user.registeredComp !== 'olim') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Kode promo ini hanya bisa digunakan untuk cabang olim!');
    }
    if (kodePromo.category !== 'olim' && user.registeredComp === 'olim') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Kode promo ini hanya bisa digunakan untuk cabang devcom!');
    }
  }
  if (kodePromo.usage >= kodePromo.maxUsage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kode promo sudah melewati maximum jumlah pemakaian');
  }
  if (!kodePromo.active) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kode promo sudah tidak berlaku');
  }
  if (compe.usedPromo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Anda sudah pernah menggunakan kode promo !!!!!');
  }

  const [oldPrice, postFix] = compe.price.split('.');
  const newPrice = parseInt(oldPrice, 10) - kodePromo.discountPrice;
  const price = `${newPrice}.${postFix}`;
  Object.assign(compe, { price, usedPromo: true, kodePromo: kode });
  kodePromo.usage += kodePromo.usage >= 0 ? 1 : 0;

  return (await Promise.all([compe.save(), kodePromo.save()]))[0];
};

module.exports = {
  createKodePromo,
  queryKodePromos,
  getKodePromoByKode,
  updateKodePromoByKode,
  updateKodePromoById,
  deleteKodePromoByKode,
  deleteKodePromoById,
  toggleActive,
  applyPromo,
};
