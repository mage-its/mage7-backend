const httpStatus = require('http-status');
const { KodePromo } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a kodePromo
 * @param {Object} kodePromoBody
 * @returns {Promise<KodePromo>}
 */
const createKodePromo = async (kodePromoBody) => {
  const kodePromo = await KodePromo.create(kodePromoBody);
  return kodePromo;
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
const queryKodePromos = async (filter, options) => {
  const kodePromos = await KodePromo.paginate(filter, options);
  return kodePromos;
};

const getKodePromoById = async (id) => {
  return KodePromo.findById(id);
};

const getKodePromoByKode = async (kode, category) => {
  const kodePromo = await KodePromo.findOne({ kode, category });
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, `Kode promo dengan kode ${kode} tidak ditemukan`);
  }
  return kodePromo;
};

const updateKodePromoByKode = async (kode, updateBody) => {
  const kodePromo = await getKodePromoByKode(kode);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  Object.assign(kodePromo, updateBody);
  await kodePromo.save();
  return kodePromo;
};

const updateKodePromoById = async (id, updateBody) => {
  const kodePromo = await getKodePromoById(id);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  Object.assign(kodePromo, updateBody);
  await kodePromo.save();
  return kodePromo;
};

const deleteKodePromoByKode = async (kode) => {
  const kodePromo = await getKodePromoByKode(kode);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  await kodePromo.remove();
  return kodePromo;
};

const deleteKodePromoById = async (id) => {
  const kodePromo = await getKodePromoById(id);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kode Promo not found');
  }
  await kodePromo.remove();
  return kodePromo;
};

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

const applyPromo = async (kode, user, compe) => {
  if (!user.registeredComp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User belum mendaftar');
  }
  const kodePromo = await getKodePromoByKode(kode, kodePromoType[user.registeredComp]);
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
  // eslint-disable-next-line no-param-reassign
  compe.price = `${newPrice}.${postFix}`;
  // eslint-disable-next-line no-param-reassign
  compe.usedPromo = true;
  kodePromo.usage += kodePromo.usage >= 0 ? 1 : 0;
  await compe.save();
  await kodePromo.save();
  return compe;
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
