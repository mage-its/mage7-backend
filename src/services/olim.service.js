const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const kodeBayarService = require('./kodeBayar.service');
const { Olim, User } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const frontendPath = require('../utils/frontendPath');
const { removeFilePaths } = require('../utils/removeFile');
const { isImageOrPdf } = require('../utils/isImageOrPdf');

const storage = multer.diskStorage({
  destination: path.join(config.frontend, 'uploads/olim/daftar'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    isImageOrPdf(file, cb);
  },
});

const multiUploads = upload.fields([
  { name: 'identitasKetua', maxCount: 1 },
  { name: 'identitasAnggota1', maxCount: 1 },
  { name: 'identitasAnggota2', maxCount: 1 },
  { name: 'buktiUploadTwibbon', maxCount: 1 },
  { name: 'buktiFollowMage', maxCount: 1 },
  { name: 'buktiRepostStory', maxCount: 1 },
]);

/**
 * Get olim by userId
 * @param {ObjectId} userId
 * @returns {Promise<Olim>}
 */
const getOlimByUserId = async (userId) => {
  return Olim.findOne({ user: userId });
};

const daftarOlim = async (olimBody, files, user) => {
  const olim = new Olim(olimBody);

  if (!files.identitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }
  olim.pathIdentitasKetua = frontendPath(files.identitasKetua[0].path);

  if (files.identitasAnggota1?.[0]?.path && olim.namaAnggota1) {
    olim.pathIdentitasAnggota1 = frontendPath(files.identitasAnggota1[0].path);
    if (files.identitasAnggota2?.[0]?.path && olim.namaAnggota2) {
      olim.pathIdentitasAnggota2 = frontendPath(files.identitasAnggota2[0].path);
    } else if (olim.namaAnggota2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
    }
  } else if (olim.namaAnggota1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
  }

  if (!files.buktiUploadTwibbon || !files.buktiFollowMage || !files.buktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }

  olim.pathBuktiUploadTwibbon = frontendPath(files.buktiUploadTwibbon[0].path);
  olim.pathBuktiFollowMage = frontendPath(files.buktiFollowMage[0].path);
  olim.pathBuktiRepostStory = frontendPath(files.buktiRepostStory[0].path);

  if (!olim.namaAnggota1 && files.identitasAnggota1?.[0]?.path) {
    removeFilePaths([frontendPath(files.identitasAnggota1[0].path)]);
  }

  if (!olim.namaAnggota2 && files.identitasAnggota2?.[0]?.path) {
    removeFilePaths([frontendPath(files.identitasAnggota2[0].path)]);
  }

  olim.user = user.id;

  const kode = await kodeBayarService.getKodeBayarByCabang('olim');

  const noUrut = kode.no.toString().padStart(3, '0');

  olim.noPeserta = `OLI0${noUrut}`;
  olim.price = `${kode.price}.${noUrut}`;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'olim';
  return Promise.all([olim.save(), user.save(), kodeBayarService.incNoUrut('olim', kode)]);
};

/**
 * Update olim by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {Olim} olimObj
 * @returns {Promise<Olim>}
 */
const updateOlimByUserId = async (userId, updateBody, olimObj) => {
  const olim = olimObj || (await getOlimByUserId(userId));
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(olim, updateBody);
  if (olim.pathIdentitasAnggota1 === null) {
    olim.namaAnggota1 = null;
  }
  if (olim.pathIdentitasAnggota2 === null) {
    olim.namaAnggota2 = null;
  }
  await olim.save();
  return olim;
};

const createOlim = async (olimBody, files, userId) => {
  const olim = new Olim(olimBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (files.identitasAnggota1?.[0]?.path) {
    olim.pathIdentitasAnggota1 = frontendPath(files.identitasAnggota1[0].path);
  }
  if (files.identitasAnggota2?.[0]?.path) {
    olim.pathIdentitasAnggota2 = frontendPath(files.identitasAnggota2[0].path);
  }
  if (files.identitasKetua?.[0]?.path) {
    olim.pathIdentitasKetua = frontendPath(files.identitasKetua[0].path);
  }
  if (files.buktiUploadTwibbon?.[0]?.path) {
    olim.pathBuktiUploadTwibbon = frontendPath(files.buktiUploadTwibbon[0].path);
  }
  if (files.buktiFollowMage?.[0]?.path) {
    olim.pathBuktiFollowMage = frontendPath(files.buktiFollowMage[0].path);
  }
  if (files.buktiRepostStory?.[0]?.path) {
    olim.pathBuktiRepostStory = frontendPath(files.buktiRepostStory[0].path);
  }

  olim.user = user.id;

  const kode = await kodeBayarService.getKodeBayarByCabang('olim');

  const noUrut = kode.no.toString().padStart(3, '0');

  olim.noPeserta = `OLI0${noUrut}`;
  olim.price = `${kode.price}.${noUrut}`;

  user.registeredComp = 'olim';
  return Promise.all([olim.save(), user.save(), kodeBayarService.incNoUrut('olim', kode)]);
};

const queryOlims = async (filter, options) => {
  const olims = await Olim.paginate(filter, options);
  return olims;
};

/**
 * Get olim by id
 * @param {ObjectId} id
 * @returns {Promise<Olim>}
 */
const getOlimById = async (id) => {
  return Olim.findById(id);
};

/**
 * Update olim by id
 * @param {ObjectId} olimId
 * @param {Object} updateBody
 * @param {Olim} olimObj
 * @returns {Promise<Olim>}
 */
const updateOlimById = async (olimId, updateBody, olimObj) => {
  const olim = olimObj || (await getOlimById(olimId));
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(olim, updateBody);
  if (olim.pathIdentitasAnggota1 === null) {
    olim.namaAnggota1 = null;
  }
  if (olim.pathIdentitasAnggota2 === null) {
    olim.namaAnggota2 = null;
  }
  await olim.save();
  return olim;
};

/**
 * Delete olim by id
 * @param {ObjectId} olimId
 * @returns {Promise<User>}
 */
const deleteOlimById = async (olimId, olimObj = null, userObj = null) => {
  const olim = olimObj || (await getOlimById(olimId));
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj || (await User.findById(olim.user));
  if (user) {
    user.registeredComp = '';
  }
  await removeFilePaths([
    olim.pathIdentitasKetua,
    olim.pathIdentitasAnggota1,
    olim.pathIdentitasAnggota2,
    olim.pathBuktiUploadTwibbon,
    olim.pathBuktiFollowMage,
    olim.pathBuktiRepostStory,
    olim.pathBuktiBayar,
  ]);
  await Promise.all([olim.remove(), user.save()]);
  return olim;
};

module.exports = {
  daftarOlim,
  multiUploads,
  queryOlims,
  createOlim,
  getOlimById,
  getOlimByUserId,
  updateOlimById,
  updateOlimByUserId,
  deleteOlimById,
};
