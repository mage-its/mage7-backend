const path = require('path');
const httpStatus = require('http-status');
const multer = require('multer');
const userService = require('./user.service');
const { Olim, GameDev } = require('../models');
const ApiError = require('../utils/ApiError');
const isImageOrPdf = require('../utils/isImageOrPdf');

const storage = multer.diskStorage({
  destination: './public/uploads/buktibayar',
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

const multiUploads = upload.fields([{ name: 'buktiBayar', maxCount: 1 }]);

const compeSelection = {
  olim: Olim,
  gamedev: GameDev,
};

const pay = async (userId, namaBayar, files) => {
  if (!files.buktiBayar) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bukti pembayaran WAJIB disertakan!');
  }

  const user = await userService.getUserById(userId);
  if (!user.registeredComp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User belum mendaftar di salah satu lomba!');
  }

  const compeModel = compeSelection[user.registeredComp];
  const compe = await compeModel.findOne({ user: userId });
  if (!compe) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User belum mendaftar di salah satu lomba!');
  }
  if (compe.sudahUploadBuktiBayar) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User sudah mengupload bukti bayar!');
  }
  compe.pathBuktiBayar = files.buktiBayar[0].path;
  compe.namaBayar = namaBayar;
  return compe.save();
};

module.exports = {
  multiUploads,
  pay,
};
