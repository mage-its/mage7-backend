const path = require('path');
const httpStatus = require('http-status');
const multer = require('multer');
const { Olim, GameDev, IotDev, AppDev } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const frontendPath = require('../utils/frontendPath');
const { isImageOrPdf } = require('../utils/isImageOrPdf');
const { userService, olimService, gameDevService, appDevService, iotDevService } = require('.');

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

const compeModels = {
  olim: Olim,
  gamedev: GameDev,
  iotdev: IotDev,
  appdev: AppDev,
};

const pay = async (userId, namaBayar, files) => {
  if (!files.buktiBayar) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bukti pembayaran WAJIB disertakan!');
  }

  const user = await userService.getUserById(userId);
  if (!user.registeredComp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User belum mendaftar di salah satu lomba!');
  }

  const compeModel = compeModels[user.registeredComp];
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

const compeMethods = {
  olim: [olimService.getOlimByUserId, olimService.updateOlimByUserId],
  gamedev: [gameDevService.getGameDevByUserId, gameDevService.updateGameDevByUserId],
  appdev: [appDevService.getAppDevByUserId, appDevService.updateAppDevByUserId],
  iotdev: [iotDevService.getIotDevByUserId, iotDevService.updateIotDevByUserId],
};

const toggleVerif = async (userId) => {
  const user = await userService.getUserById(userId);
  if (user.registeredComp === '') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User belum mendaftar di salah satu lomba!');
  }
  if (!(user.registeredComp in compeMethods)) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cabang lomba yang terdaftar tidak diketahui');
  }
  const compe = await compeMethods[user.registeredComp][0](user.id);
  if (!compe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return compeMethods[user.registeredComp][1](user.id, { isVerified: !compe.isVerified }, compe);
};

module.exports = {
  multiUploads,
  pay,
  toggleVerif,
};
