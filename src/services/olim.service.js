const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const { promisify } = require('util');
const { unlink } = require('fs');
const { User, Olim } = require('../models');
const ApiError = require('../utils/ApiError');

const unlinkAsync = promisify(unlink);

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

const isRegistered = async (user) => {
  return !(await User.findOne({ _id: user.id, registeredComp: '' }));
};

const daftarOlim = async (olimBody) => {
  const olim = new Olim(olimBody);
  return olim;
};

const cekTerdaftar = async (user) => {
  if (await isRegistered(user)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User sudah terdaftar di salah satu cabang');
  }
};

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

const removeFileErr = async (files) => {
  if (files) {
    if (files.identitasKetua && files.identitasKetua[0] && files.identitasKetua[0].path) {
      await unlinkAsync(files.identitasKetua[0].path);
    }
    if (files.identitasAnggota1 && files.identitasAnggota1[0] && files.identitasAnggota1[0].path) {
      await unlinkAsync(files.identitasAnggota1[0].path);
    }
    if (files.identitasAnggota2 && files.identitasAnggota2[0] && files.identitasAnggota2[0].path) {
      await unlinkAsync(files.identitasAnggota2[0].path);
    }
    if (files.suratKeteranganSiswa && files.suratKeteranganSiswa[0] && files.suratKeteranganSiswa[0].path) {
      await unlinkAsync(files.suratKeteranganSiswa[0].path);
    }
  }
};

module.exports = {
  daftarOlim,
  multiUploads,
  simpanDataOlim,
  cekTerdaftar,
  removeFileErr,
};
