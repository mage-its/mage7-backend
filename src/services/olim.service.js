const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const { Olim, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { removeFilePaths } = require('../utils/removeFile');

const storage = multer.diskStorage({
  destination: './public/uploads/olim',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /(?:jp(?:eg|g)|p(?:df|ng))$/; // /jpeg|jpg|png|pdf/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new ApiError(httpStatus.BAD_REQUEST, 'Please upload an Image or PDF'));
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

const multiUploads = upload.fields([
  { name: 'identitasKetua', maxCount: 1 },
  { name: 'identitasAnggota1', maxCount: 1 },
  { name: 'identitasAnggota2', maxCount: 1 },
  { name: 'suratKeteranganSiswa', maxCount: 1 },
]);

const daftarOlim = async (req) => {
  const { user, files, body } = req;
  const olim = new Olim(body);
  olim.pathIdentitasKetua = files.identitasKetua[0].path;
  olim.pathIdentitasAnggota1 = files.identitasAnggota1[0].path;
  olim.pathIdentitasAnggota2 = files.identitasAnggota2[0].path;
  olim.pathSuratKeteranganSiswa = files.suratKeteranganSiswa[0].path;
  olim.user = user.id;
  user.registeredComp = 'olim';
  return Promise.all([olim.save(), user.save()]);
};

/**
 * Get olim by userId
 * @param {ObjectId} userId
 * @returns {Promise<Olim>}
 */
const getOlimByUserId = async (userId) => {
  return Olim.findOne({ user: userId });
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
    olim.pathSuratKeteranganSiswa,
  ]);
  Promise.all([olim.remove(), user.save()]);
  return olim;
};

module.exports = {
  daftarOlim,
  multiUploads,
  queryOlims,
  getOlimById,
  getOlimByUserId,
  updateOlimById,
  deleteOlimById,
};
