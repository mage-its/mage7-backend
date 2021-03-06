const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const sanitizeFilename = require('sanitize-filename');
const kodeBayarService = require('./kodeBayar.service');
const { GameDev, User } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const frontendPath = require('../utils/frontendPath');
const { removeFilePaths } = require('../utils/removeFile');
const { isImageOrPdf, isPdf } = require('../utils/isImageOrPdf');

const storage = multer.diskStorage({
  destination: path.join(config.frontend, 'uploads/gamedev/daftar'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const proposalStorage = multer.diskStorage({
  destination: path.join(config.frontend, 'uploads/gamedev/proposal'),
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
 * Get gamedev by user id
 * @param {ObjectId} user
 * @returns {Promise<GameDev>}
 */
const getGameDevByUserId = async (user) => {
  return GameDev.findOne({ user });
};

/**
 * Get gamedev by nama tim
 * @param {string} namaTim
 * @returns {Promise<GameDev>}
 */
const getGameDevByNamaTim = async (namaTim) => {
  return GameDev.findOne({ namaTim });
};

/**
 * Register gamedev service
 * @param {Object} gameDevBody
 * @param {Object} files
 * @param {User} user
 * @returns {Promise<Array<Promise<GameDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const daftarGameDev = async (gameDevBody, files, user) => {
  const gameDev = new GameDev(gameDevBody);

  if (!files.identitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }
  gameDev.pathIdentitasKetua = frontendPath(files.identitasKetua[0].path);

  if (files.identitasAnggota1?.[0]?.path && gameDev.namaAnggota1) {
    gameDev.pathIdentitasAnggota1 = frontendPath(files.identitasAnggota1[0].path);
    if (files.identitasAnggota2?.[0]?.path && gameDev.namaAnggota2) {
      gameDev.pathIdentitasAnggota2 = frontendPath(files.identitasAnggota2[0].path);
    } else if (gameDev.namaAnggota2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
    }
  } else if (gameDev.namaAnggota1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
  }

  if (!files.buktiUploadTwibbon || !files.buktiFollowMage || !files.buktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }

  gameDev.pathBuktiUploadTwibbon = frontendPath(files.buktiUploadTwibbon[0].path);
  gameDev.pathBuktiFollowMage = frontendPath(files.buktiFollowMage[0].path);
  gameDev.pathBuktiRepostStory = frontendPath(files.buktiRepostStory[0].path);

  if (!gameDev.namaAnggota1 && files.identitasAnggota1?.[0]?.path) {
    removeFilePaths([frontendPath(files.identitasAnggota1[0].path)]);
  }

  if (!gameDev.namaAnggota2 && files.identitasAnggota2?.[0]?.path) {
    removeFilePaths([frontendPath(files.identitasAnggota2[0].path)]);
  }

  gameDev.user = user.id;

  const cabang = gameDevBody.kategori === 'Siswa' ? 'gdevs' : 'gdevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = gameDevBody.kategori === 'Siswa' ? '0' : '1';

  gameDev.noPeserta = `DCG${noUrutPrefix}${noUrut}`;
  gameDev.price = `${kode.price}.${noUrut}`;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'gamedev';
  return Promise.all([gameDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Upload proposal
 * @param {ObjectId} userId
 * @param {Object} files
 * @returns {Promise<GameDev>}
 */
const uploadProposal = async (userId, files) => {
  const gameDev = await getGameDevByUserId(userId);
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  if (gameDev.tahap !== 1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Upload proposal hanya saat tahap 1, anda sekarang di tahap ${gameDev.tahap}`
    );
  }
  if (!files.proposal?.[0]?.path) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File proposal harus diupload');
  }
  // Delete proposal if exist
  if (gameDev.pathProposal) {
    await removeFilePaths([gameDev.pathProposal]);
  }
  gameDev.pathProposal = frontendPath(files.proposal[0].path);
  return gameDev.save();
};

/**
 * Update gamedev by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {GameDev} gameObj
 * @returns {Promise<GameDev>}
 */
const updateGameDevByUserId = async (userId, updateBody, gameObj = null) => {
  const gameDev = gameObj ?? (await getGameDevByUserId(userId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(gameDev, updateBody);
  if (gameDev.pathIdentitasAnggota1 === null) {
    gameDev.namaAnggota1 = null;
  }
  if (gameDev.pathIdentitasAnggota2 === null) {
    gameDev.namaAnggota2 = null;
  }
  return gameDev.save();
};

/**
 * Create gamedev
 * @param {Object} gameDevBody
 * @param {Object} files
 * @param {ObjectId} userId
 * @returns {Promise<Array<Promise<GameDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const createGameDev = async (gameDevBody, files, userId) => {
  const gameDev = new GameDev(gameDevBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (files.identitasAnggota1?.[0]?.path) {
    gameDev.pathIdentitasAnggota1 = frontendPath(files.identitasAnggota1[0].path);
  }
  if (files.identitasAnggota2?.[0]?.path) {
    gameDev.pathIdentitasAnggota2 = frontendPath(files.identitasAnggota2[0].path);
  }
  if (files.identitasKetua?.[0]?.path) {
    gameDev.pathIdentitasKetua = frontendPath(files.identitasKetua[0].path);
  }
  if (files.buktiUploadTwibbon?.[0]?.path) {
    gameDev.pathBuktiUploadTwibbon = frontendPath(files.buktiUploadTwibbon[0].path);
  }
  if (files.buktiFollowMage?.[0]?.path) {
    gameDev.pathBuktiFollowMage = frontendPath(files.buktiFollowMage[0].path);
  }
  if (files.buktiRepostStory?.[0]?.path) {
    gameDev.pathBuktiRepostStory = frontendPath(files.buktiRepostStory[0].path);
  }
  const cabang = gameDevBody.kategori === 'Siswa' ? 'gdevs' : 'gdevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = gameDevBody.kategori === 'Siswa' ? '0' : '1';

  gameDev.noPeserta = `DCG${noUrutPrefix}${noUrut}`;
  gameDev.price = `${kode.price}.${noUrut}`;
  gameDev.user = user.id;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'gamedev';
  return Promise.all([gameDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Query for gamedevs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGameDevs = async (filter, options) => {
  const gameDevs = await GameDev.paginate(filter, options);
  return gameDevs;
};

/**
 * Get gamedev by id
 * @param {ObjectId} id
 * @returns {Promise<GameDev>}
 */
const getGameDevById = async (id) => {
  return GameDev.findById(id);
};

/**
 * Update gamedev by id
 * @param {ObjectId} gameDevId
 * @param {Object} updateBody
 * @param {GameDev} gameObj
 * @returns {Promise<GameDev>}
 */
const updateGameDevById = async (gameDevId, updateBody, gameObj = null) => {
  const gameDev = gameObj ?? (await getGameDevById(gameDevId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(gameDev, updateBody);
  if (gameDev.pathIdentitasAnggota1 === null) {
    gameDev.namaAnggota1 = null;
  }
  if (gameDev.pathIdentitasAnggota2 === null) {
    gameDev.namaAnggota2 = null;
  }
  return gameDev.save();
};

/**
 * Delete gamedev by id
 * @param {ObjectId} gameDevId
 * @returns {Promise<GameDev>}
 */
const deleteGameDevById = async (gameDevId, gameDevObj = null, userObj = null) => {
  const gameDev = gameDevObj ?? (await getGameDevById(gameDevId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj ?? (await User.findById(gameDev.user));
  if (user) {
    user.registeredComp = '';
  }
  await removeFilePaths([
    gameDev.pathIdentitasKetua,
    gameDev.pathIdentitasAnggota1,
    gameDev.pathIdentitasAnggota2,
    gameDev.pathBuktiUploadTwibbon,
    gameDev.pathBuktiFollowMage,
    gameDev.pathBuktiRepostStory,
    gameDev.pathProposal,
    gameDev.pathBuktiBayar,
  ]);
  await Promise.all([gameDev.remove(), user.save()]);
  return gameDev;
};

/**
 * Toggle verification
 * @param {ObjectId} gameDevId
 * @param {GameDev} [gameDevObj=null]
 * @returns {Promise<GameDev>}
 */
const toggleVerif = async (gameDevId, gameDevObj = null) => {
  const gameDev = gameDevObj ?? (await getGameDevById(gameDevId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  return updateGameDevById(gameDev.id, { isVerified: !gameDev.isVerified }, gameDev);
};

/**
 * Increment tahap
 * @param {ObjectId} gameDevId
 * @returns {Promise<GameDev>}
 */
const incTahap = async (gameDevId) => {
  const gameDev = await getGameDevById(gameDevId);
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (gameDev.tahap < 3) {
    return updateGameDevById(gameDev.id, { tahap: gameDev.tahap + 1 }, gameDev);
  }
};

/**
 * Decrement tahap
 * @param {ObjectId} gameDevId
 * @returns {Promise<GameDev>}
 */
const decTahap = async (gameDevId) => {
  const gameDev = await getGameDevById(gameDevId);
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (gameDev.tahap > 1) {
    return updateGameDevById(gameDev.id, { tahap: gameDev.tahap - 1 }, gameDev);
  }
};

module.exports = {
  daftarGameDev,
  uploadProposal,
  multiUploads,
  multerProposal,
  queryGameDevs,
  createGameDev,
  getGameDevById,
  getGameDevByUserId,
  getGameDevByNamaTim,
  updateGameDevById,
  updateGameDevByUserId,
  deleteGameDevById,
  toggleVerif,
  incTahap,
  decTahap,
};
