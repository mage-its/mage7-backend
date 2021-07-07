const path = require('path');
const httpStatus = require('http-status');
const multer = require('multer');
const userService = require('./user.service');
const { Olim, GameDev } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const frontendPath = require('../utils/frontendPath');
const { isImageOrPdf } = require('../utils/isImageOrPdf');

const storage = multer.diskStorage({
  destination: path.join(config.frontend, 'uploads/buktibayar'),
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

  if (user.registeredComp !== 'olim') {
    if (compe.tahap !== 2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Peserta belum lolos tahap 2!');
    }
  }

  if (compe.sudahUploadBuktiBayar) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User sudah mengupload bukti bayar!');
  }
  compe.pathBuktiBayar = frontendPath(files.buktiBayar[0].path, 3);
  compe.namaBayar = namaBayar;
  return compe.save();
};

module.exports = {
  multiUploads,
  pay,
};
