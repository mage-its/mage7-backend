const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const sanitizeFilename = require('sanitize-filename');
const kodeBayarService = require('./kodeBayar.service');
const { IotDev, User } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const frontendPath = require('../utils/frontendPath');
const { removeFilePaths } = require('../utils/removeFile');
const { isImageOrPdf, isPdf } = require('../utils/isImageOrPdf');

const storage = multer.diskStorage({
  destination: path.join(config.frontend, 'uploads/iotdev/daftar'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const proposalStorage = multer.diskStorage({
  destination: path.join(config.frontend, 'uploads/iotdev/proposal'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}${Math.round(Math.random() * 1e5)}`;
    const cleanName = sanitizeFilename(file.originalname);
    cb(null, `${path.parse(cleanName).name}-${uniqueSuffix}${path.extname(file.originalname)}`);
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

const multerProposal = multer({
  storage: proposalStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    isPdf(file, cb);
  },
}).fields([{ name: 'proposal', maxCount: 1 }]);

const multiUploads = upload.fields([
  { name: 'identitasKetua', maxCount: 1 },
  { name: 'identitasAnggota1', maxCount: 1 },
  { name: 'identitasAnggota2', maxCount: 1 },
  { name: 'buktiUploadTwibbon', maxCount: 1 },
  { name: 'buktiFollowMage', maxCount: 1 },
  { name: 'buktiRepostStory', maxCount: 1 },
]);

/**
 * Get iotdev by user id
 * @param {ObjectId} user
 * @returns {Promise<IotDev>}
 */
const getIotDevByUserId = async (user) => {
  return IotDev.findOne({ user });
};

/**
 * Get iotdev by nama tim
 * @param {string} namaTim
 * @returns {Promise<IotDev>}
 */
const getIotDevByNamaTim = async (namaTim) => {
  return IotDev.findOne({ namaTim });
};

/**
 * Register iotdev service
 * @param {Object} iotDevBody
 * @param {Object} files
 * @param {User} user
 * @returns {Promise<Array<Promise<IotDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const daftarIotDev = async (iotDevBody, files, user) => {
  const iotDev = new IotDev(iotDevBody);

  if (!files.identitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }
  iotDev.pathIdentitasKetua = frontendPath(files.identitasKetua[0].path);

  if (files.identitasAnggota1?.[0]?.path && iotDev.namaAnggota1) {
    iotDev.pathIdentitasAnggota1 = frontendPath(files.identitasAnggota1[0].path);
    if (files.identitasAnggota2?.[0]?.path && iotDev.namaAnggota2) {
      iotDev.pathIdentitasAnggota2 = frontendPath(files.identitasAnggota2[0].path);
    } else if (iotDev.namaAnggota2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
    }
  } else if (iotDev.namaAnggota1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
  }

  if (!files.buktiUploadTwibbon || !files.buktiFollowMage || !files.buktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }

  iotDev.pathBuktiUploadTwibbon = frontendPath(files.buktiUploadTwibbon[0].path);
  iotDev.pathBuktiFollowMage = frontendPath(files.buktiFollowMage[0].path);
  iotDev.pathBuktiRepostStory = frontendPath(files.buktiRepostStory[0].path);

  if (!iotDev.namaAnggota1 && files.identitasAnggota1?.[0]?.path) {
    removeFilePaths([frontendPath(files.identitasAnggota1[0].path)]);
  }

  if (!iotDev.namaAnggota2 && files.identitasAnggota2?.[0]?.path) {
    removeFilePaths([frontendPath(files.identitasAnggota2[0].path)]);
  }

  iotDev.user = user.id;

  const cabang = 'idev';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = '1';

  iotDev.noPeserta = `DCI${noUrutPrefix}${noUrut}`;
  iotDev.price = `${kode.price}.${noUrut}`;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'iotdev';
  return Promise.all([iotDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Upload proposal
 * @param {ObjectId} userId
 * @param {Object} files
 * @returns {Promise<IotDev>}
 */
const uploadProposal = async (userId, files) => {
  const iotDev = await getIotDevByUserId(userId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  if (iotDev.tahap !== 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Upload proposal hanya saat tahap 1, anda sekarang di tahap ${iotDev.tahap}`);
  }
  if (!files.proposal?.[0]?.path) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File proposal harus diupload');
  }
  // Delete proposal if exist
  if (iotDev.pathProposal) {
    await removeFilePaths([iotDev.pathProposal]);
  }
  iotDev.pathProposal = frontendPath(files.proposal[0].path);
  return iotDev.save();
};

/**
 * Update iotdev by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {IotDev} iotObj
 * @returns {Promise<IotDev>}
 */
const updateIotDevByUserId = async (userId, updateBody, iotObj = null) => {
  const iotDev = iotObj ?? (await getIotDevByUserId(userId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(iotDev, updateBody);
  if (iotDev.pathIdentitasAnggota1 === null) {
    iotDev.namaAnggota1 = null;
  }
  if (iotDev.pathIdentitasAnggota2 === null) {
    iotDev.namaAnggota2 = null;
  }
  return iotDev.save();
};

/**
 * Create iotdev
 * @param {Object} iotDevBody
 * @param {Object} files
 * @param {ObjectId} userId
 * @returns {Promise<Array<Promise<IotDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const createIotDev = async (iotDevBody, files, userId) => {
  const iotDev = new IotDev(iotDevBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (files.identitasAnggota1?.[0]?.path) {
    iotDev.pathIdentitasAnggota1 = frontendPath(files.identitasAnggota1[0].path);
  }
  if (files.identitasAnggota2?.[0]?.path) {
    iotDev.pathIdentitasAnggota2 = frontendPath(files.identitasAnggota2[0].path);
  }
  if (files.identitasKetua?.[0]?.path) {
    iotDev.pathIdentitasKetua = frontendPath(files.identitasKetua[0].path);
  }
  if (files.buktiUploadTwibbon?.[0]?.path) {
    iotDev.pathBuktiUploadTwibbon = frontendPath(files.buktiUploadTwibbon[0].path);
  }
  if (files.buktiFollowMage?.[0]?.path) {
    iotDev.pathBuktiFollowMage = frontendPath(files.buktiFollowMage[0].path);
  }
  if (files.buktiRepostStory?.[0]?.path) {
    iotDev.pathBuktiRepostStory = frontendPath(files.buktiRepostStory[0].path);
  }
  const cabang = 'idev';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = '1';

  iotDev.noPeserta = `DCI${noUrutPrefix}${noUrut}`;
  iotDev.price = `${kode.price}.${noUrut}`;
  iotDev.user = user.id;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'iotdev';
  return Promise.all([iotDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Query for iotdevs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIotDevs = async (filter, options) => {
  const iotDevs = await IotDev.paginate(filter, options);
  return iotDevs;
};

/**
 * Get iotdev by id
 * @param {ObjectId} id
 * @returns {Promise<IotDev>}
 */
const getIotDevById = async (id) => {
  return IotDev.findById(id);
};

/**
 * Update iotdev by id
 * @param {ObjectId} iotDevId
 * @param {Object} updateBody
 * @param {IotDev} iotObj
 * @returns {Promise<IotDev>}
 */
const updateIotDevById = async (iotDevId, updateBody, iotObj = null) => {
  const iotDev = iotObj ?? (await getIotDevById(iotDevId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(iotDev, updateBody);
  if (iotDev.pathIdentitasAnggota1 === null) {
    iotDev.namaAnggota1 = null;
  }
  if (iotDev.pathIdentitasAnggota2 === null) {
    iotDev.namaAnggota2 = null;
  }
  return iotDev.save();
};

/**
 * Delete iotdev by id
 * @param {ObjectId} iotDevId
 * @returns {Promise<IotDev>}
 */
const deleteIotDevById = async (iotDevId, iotDevObj = null, userObj = null) => {
  const iotDev = iotDevObj ?? (await getIotDevById(iotDevId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj ?? (await User.findById(iotDev.user));
  if (user) {
    user.registeredComp = '';
  }
  await removeFilePaths([
    iotDev.pathIdentitasKetua,
    iotDev.pathIdentitasAnggota1,
    iotDev.pathIdentitasAnggota2,
    iotDev.pathBuktiUploadTwibbon,
    iotDev.pathBuktiFollowMage,
    iotDev.pathBuktiRepostStory,
    iotDev.pathProposal,
    iotDev.pathBuktiBayar,
  ]);
  await Promise.all([iotDev.remove(), user.save()]);
  return iotDev;
};

/**
 * Toggle verification
 * @param {ObjectId} iotDevId
 * @param {IotDev} [iotDevObj=null]
 * @returns {Promise<IotDev>}
 */
const toggleVerif = async (iotDevId, iotDevObj = null) => {
  const iotDev = iotDevObj ?? (await getIotDevById(iotDevId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  return updateIotDevById(iotDev.id, { isVerified: !iotDev.isVerified }, iotDev);
};

/**
 * Increment tahap
 * @param {ObjectId} iotDevId
 * @returns {Promise<IotDev>}
 */
const incTahap = async (iotDevId) => {
  const iotDev = await getIotDevById(iotDevId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (iotDev.tahap < 3) {
    return updateIotDevById(iotDev.id, { tahap: iotDev.tahap + 1 }, iotDev);
  }
};

/**
 * Decrement tahap
 * @param {ObjectId} iotDevId
 * @returns {Promise<IotDev>}
 */
const decTahap = async (iotDevId) => {
  const iotDev = await getIotDevById(iotDevId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (iotDev.tahap > 1) {
    return updateIotDevById(iotDev.id, { tahap: iotDev.tahap - 1 }, iotDev);
  }
};

module.exports = {
  daftarIotDev,
  uploadProposal,
  multiUploads,
  multerProposal,
  queryIotDevs,
  createIotDev,
  getIotDevById,
  getIotDevByUserId,
  getIotDevByNamaTim,
  updateIotDevById,
  updateIotDevByUserId,
  deleteIotDevById,
  toggleVerif,
  incTahap,
  decTahap,
};
