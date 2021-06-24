const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const { Olim } = require('../models');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: './public/uploads/olim',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Please upload an Image');
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      checkFileType(file, cb);
    }
    cb(null, true);
  },
});

const multiUploads = upload.fields([
  { name: 'identitasKetua', maxCount: 1 },
  { name: 'identitasAnggota1', maxCount: 1 },
  { name: 'identitasAnggota2', maxCount: 1 },
  { name: 'suratKeteranganSiswa', maxCount: 1 },
]);

const daftarOlim = async (olimBody) => new Olim(olimBody);

const simpanDataOlim = async (req) => {
  const { olim, user, files } = req;
  olim.pathIdentitasKetua = files.identitasKetua[0].path;
  olim.pathIdentitasAnggota1 = files.identitasAnggota1[0].path;
  olim.pathIdentitasAnggota2 = files.identitasAnggota2[0].path;
  olim.pathSuratKeteranganSiswa = files.suratKeteranganSiswa[0].path;
  olim.user = user.id;
  user.registeredComp = 'olim';
  await olim.save();
  await user.save();
  return olim;
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
 * @returns {Promise<Olim>}
 */
const updateOlimById = async (olimId, updateBody) => {
  const olim = await getOlimById(olimId);
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(olim, updateBody);
  await olim.save();
  return olim;
};

/**
 * Delete olim by id
 * @param {ObjectId} olimId
 * @returns {Promise<User>}
 */
const deleteOlimById = async (olimId) => {
  const olim = await getOlimById(olimId);
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  await olim.remove();
  return olim;
};

module.exports = {
  daftarOlim,
  multiUploads,
  simpanDataOlim,
  queryOlims,
  getOlimById,
  updateOlimById,
  deleteOlimById,
};
