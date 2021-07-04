const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const kodeBayarService = require('./kodeBayar.service');
const { IotDev, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { removeFilePaths } = require('../utils/removeFile');
const { isImageOrPdf, isPdf } = require('../utils/isImageOrPdf');

const storage = multer.diskStorage({
  destination: './public/uploads/iotdev',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const proposalStorage = multer.diskStorage({
  destination: './public/uploads/iotdev/proposal',
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

const multerProposal = multer({
  storage: proposalStorage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    isPdf(file, cb);
  },
}).fields([{ name: 'proposalIotDev', maxCount: 1 }]);

const multiUploads = upload.fields([
  { name: 'identitasKetua', maxCount: 1 },
  { name: 'identitasAnggota1', maxCount: 1 },
  { name: 'identitasAnggota2', maxCount: 1 },
  { name: 'suratKeteranganSiswa', maxCount: 1 },
  { name: 'persyaratanRegistrasi', maxCount: 1 },
]);

/**
 * Get iotdev by userId
 * @param {ObjectId} userId
 * @returns {Promise<IotDev>}
 */
const getIotDevByUserId = async (userId) => {
  return IotDev.findOne({ user: userId });
};

const daftarIotDev = async (iotDevBody, files, user) => {
  const iotDev = new IotDev(iotDevBody);

  if (!files.identitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }
  iotDev.pathIdentitasKetua = files.identitasKetua[0].path;

  if (files.identitasAnggota1?.[0]?.path && iotDev.namaAnggota1) {
    iotDev.pathIdentitasAnggota1 = files.identitasAnggota1[0].path;
    if (files.identitasAnggota2?.[0]?.path && iotDev.namaAnggota2) {
      iotDev.pathIdentitasAnggota2 = files.identitasAnggota2[0].path;
    } else if (iotDev.namaAnggota2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
    }
  } else if (iotDev.namaAnggota1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semua Identitas anggota WAJIB diberikan');
  }

  if (!files.persyaratanRegistrasi) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }

  iotDev.pathPersyaratanRegistrasi = files.persyaratanRegistrasi[0].path;

  if (!iotDev.namaAnggota1 && files.identitasAnggota1?.[0]?.path) {
    removeFilePaths([files.identitasAnggota1[0].path]);
  }

  if (!iotDev.namaAnggota2 && files.identitasAnggota2?.[0]?.path) {
    removeFilePaths([files.identitasAnggota2[0].path]);
  }

  if (iotDevBody.kategori === 'Siswa') {
    if (!files.suratKeteranganSiswa) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Surat keterangan siswa WAJIB diberikan bagi peserta kategori siswa');
    }
    iotDev.pathSuratKeteranganSiswa = files.suratKeteranganSiswa[0].path;
  } else if (files.suratKeteranganSiswa?.[0]?.path) {
    removeFilePaths([files.suratKeteranganSiswa[0].path]);
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

const uploadProposal = async (userId, files) => {
  const iotDev = await getIotDevByUserId(userId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  if (iotDev.tahap !== 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Upload proposal hanya saat tahap 1, anda sekarang di tahap ${iotDev.tahap}`);
  }
  if (!files.proposalIotDev?.[0]?.path) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File proposal harus diupload');
  }
  iotDev.pathProposal = files.proposalIotDev[0].path;
  return iotDev.save();
};

/**
 * Update iotdev by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<IotDev>}
 */
const updateIotDevByUserId = async (userId, updateBody) => {
  const iotDev = await getIotDevByUserId(userId);
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
  await iotDev.save();
  return iotDev;
};

const createIotDev = async (iotDevBody, files, userId) => {
  const iotDev = new IotDev(iotDevBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (files.identitasAnggota1?.[0]?.path) {
    iotDev.pathIdentitasAnggota1 = files.identitasAnggota1[0].path;
  }
  if (files.identitasAnggota2?.[0]?.path) {
    iotDev.pathIdentitasAnggota2 = files.identitasAnggota2[0].path;
  }
  if (files.suratKeteranganSiswa?.[0]?.path) {
    iotDev.pathSuratKeteranganSiswa = files.suratKeteranganSiswa[0].path;
  }
  if (files.identitasKetua?.[0]?.path) {
    iotDev.pathIdentitasKetua = files.identitasKetua[0].path;
  }
  if (files.persyaratanRegistrasi?.[0]?.path) {
    iotDev.pathPersyaratanRegistrasi = files.persyaratanRegistrasi[0].path;
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
 * @returns {Promise<IotDev>}
 */
const updateIotDevById = async (iotDevId, updateBody) => {
  const iotDev = await getIotDevById(iotDevId);
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
  await iotDev.save();
  return iotDev;
};

/**
 * Delete iotdev by id
 * @param {ObjectId} iotDevId
 * @returns {Promise<IotDev>}
 */
const deleteIotDevById = async (iotDevId, iotDevObj = null, userObj = null) => {
  const iotDev = iotDevObj || (await getIotDevById(iotDevId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj || (await User.findById(iotDev.user));
  if (user) {
    user.registeredComp = '';
  }
  await removeFilePaths([
    iotDev.pathIdentitasKetua,
    iotDev.pathIdentitasAnggota1,
    iotDev.pathIdentitasAnggota2,
    iotDev.pathSuratKeteranganSiswa,
    iotDev.pathPersyaratanRegistrasi,
    iotDev.pathProposal,
    iotDev.pathBuktiBayar,
  ]);
  await Promise.all([iotDev.remove(), user.save()]);
  return iotDev;
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
  updateIotDevById,
  updateIotDevByUserId,
  deleteIotDevById,
};
