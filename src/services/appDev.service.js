const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const kodeBayarService = require('./kodeBayar.service');
const { AppDev, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { removeFilePaths } = require('../utils/removeFile');
const isImageOrPdf = require('../utils/isImageOrPdf');

const storage = multer.diskStorage({
  destination: './public/uploads/appdev',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    isImageOrPdf(file, cb);
  },
});

const multiUploads = upload.fields([
  { name: 'identitasKetua', maxCount: 1 },
  { name: 'identitasAnggota1', maxCount: 1 },
  { name: 'identitasAnggota2', maxCount: 1 },
  { name: 'suratKeteranganSiswa', maxCount: 1 },
]);

/**
 * Get appdev by userId
 * @param {ObjectId} userId
 * @returns {Promise<GameDev>}
 */
const getAppDevByUserId = async (userId) => {
  return AppDev.findOne({ user: userId });
};

const daftarAppDev = async (appDevBody, files, user) => {
  const appDev = new AppDev(appDevBody);

  if (!files.identitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }
  appDev.pathIdentitasKetua = files.identitasKetua[0].path;

  if (files.identitasAnggota1?.[0]?.path && appDev.namaAnggota1) {
    appDev.pathIdentitasAnggota1 = files.identitasAnggota1[0].path;
    if (files.identitasAnggota2?.[0]?.path && appDev.namaAnggota2) {
      appDev.pathIdentitasAnggota2 = files.identitasAnggota2[0].path;
    } else if (appDev.namaAnggota2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
    }
  } else if (appDev.namaAnggota1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
  }

  if (!appDev.namaAnggota1 && files.identitasAnggota1?.[0]?.path) {
    removeFilePaths([files.identitasAnggota1[0].path]);
  }

  if (!appDev.namaAnggota2 && files.identitasAnggota2?.[0]?.path) {
    removeFilePaths([files.identitasAnggota2[0].path]);
  }

  if (appDevBody.kategori === 'Siswa') {
    if (!files.suratKeteranganSiswa) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Surat keterangan siswa WAJIB diberikan bagi peserta kategori siswa');
    }
    appDev.pathSuratKeteranganSiswa = files.suratKeteranganSiswa[0].path;
  } else if (files.suratKeteranganSiswa?.[0]?.path) {
    removeFilePaths([files.suratKeteranganSiswa[0].path]);
  }
  appDev.user = user.id;

  const cabang = appDevBody.kategori === 'Siswa' ? 'adevs' : 'adevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = appDevBody.kategori === 'Siswa' ? '0' : '1';

  appDev.noPeserta = `DCA${noUrutPrefix}${noUrut}`;
  appDev.price = `${kode.price}.${noUrut}`;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'appdev';
  return Promise.all([appDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Update appdev by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<GameDev>}
 */
const updateAppDevByUserId = async (userId, updateBody) => {
  const appDev = await getAppDevByUserId(userId);
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(appDev, updateBody);
  if (appDev.pathIdentitasAnggota1 === null) {
    appDev.namaAnggota1 = null;
  }
  if (appDev.pathIdentitasAnggota2 === null) {
    appDev.namaAnggota2 = null;
  }
  await appDev.save();
  return appDev;
};

const createAppDev = async (appDevBody, files, userId) => {
  const appDev = new AppDev(appDevBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (files.identitasAnggota1?.[0]?.path) {
    appDev.pathIdentitasAnggota1 = files.identitasAnggota1[0].path;
  }
  if (files.identitasAnggota2?.[0]?.path) {
    appDev.pathIdentitasAnggota2 = files.identitasAnggota2[0].path;
  }
  if (files.suratKeteranganSiswa?.[0]?.path) {
    appDev.pathSuratKeteranganSiswa = files.suratKeteranganSiswa[0].path;
  }
  if (files.identitasKetua?.[0]?.path) {
    appDev.pathIdentitasKetua = files.identitasKetua[0].path;
  }
  const cabang = appDevBody.kategori === 'Siswa' ? 'adevs' : 'adevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = appDevBody.kategori === 'Siswa' ? '0' : '1';

  appDev.noPeserta = `DCA${noUrutPrefix}${noUrut}`;
  appDev.price = `${kode.price}.${noUrut}`;
  appDev.user = user.id;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'appdev';
  return Promise.all([appDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

const queryAppDevs = async (filter, options) => {
  const appDevs = await AppDev.paginate(filter, options);
  return appDevs;
};

/**
 * Get appdev by id
 * @param {ObjectId} id
 * @returns {Promise<AppDev>}
 */
const getAppDevById = async (id) => {
  return AppDev.findById(id);
};

/**
 * Update appdev by id
 * @param {ObjectId} appDevId
 * @param {Object} updateBody
 * @returns {Promise<AppDev>}
 */
const updateAppDevById = async (appDevId, updateBody) => {
  const appDev = await getAppDevById(appDevId);
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(appDev, updateBody);
  if (appDev.pathIdentitasAnggota1 === null) {
    appDev.namaAnggota1 = null;
  }
  if (appDev.pathIdentitasAnggota2 === null) {
    appDev.namaAnggota2 = null;
  }
  await appDev.save();
  return appDev;
};

/**
 * Delete appdev by id
 * @param {ObjectId} appdevId
 * @returns {Promise<AppDev>}
 */
const deleteAppDevById = async (appDevId, appDevObj = null, userObj = null) => {
  const appDev = appDevObj || (await getAppDevById(appDevId));
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj || (await User.findById(appDev.user));
  if (user) {
    user.registeredComp = '';
  }
  await removeFilePaths([
    appDev.pathIdentitasKetua,
    appDev.pathIdentitasAnggota1,
    appDev.pathIdentitasAnggota2,
    appDev.pathSuratKeteranganSiswa,
    appDev.pathProposal,
    appDev.pathBuktiBayar,
  ]);
  await Promise.all([appDev.remove(), user.save()]);
  return appDev;
};

module.exports = {
  daftarAppDev,
  multiUploads,
  queryAppDevs,
  createAppDev,
  getAppDevById,
  getAppDevByUserId,
  updateAppDevById,
  updateAppDevByUserId,
  deleteAppDevById,
};
