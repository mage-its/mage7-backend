const path = require('path');
const httpStatus = require('http-status');
const multer = require('multer');
const { parseAsync } = require('json2csv');
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
    fileSize: 2 * 1024 * 1024, // 1000000 Bytes = 1 MB
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

/**
 * Pay
 * @param {ObjectId} userId
 * @param {string} namaBayar
 * @param {Object} files
 * @returns {Promise<AppDev|GameDev|IotDev|Olim>}
 */
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

const compeToggleVerif = [
  olimService.toggleVerif,
  gameDevService.toggleVerif,
  appDevService.toggleVerif,
  iotDevService.toggleVerif,
];

/**
 * Query for competitions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<Object>}
 */
const queryCompetitions = async (filter, options) => {
  const [olim, gameDev, appDev, iotDev] = await Promise.all([
    olimService.queryOlims(filter, options),
    gameDevService.queryGameDevs(filter, options),
    appDevService.queryAppDevs(filter, options),
    iotDevService.queryIotDevs(filter, options),
  ]);

  return {
    results: [...olim.results, ...gameDev.results, ...appDev.results, ...iotDev.results],
  };
};

/**
 * Get competition by id
 * @param {ObjectId} id
 * @returns {Promise<Array<Olim|GameDev|AppDev|IotDev|null, number>>}
 */
const getCompeById = async (id) => {
  const compe = await Promise.all([
    olimService.getOlimById(id),
    gameDevService.getGameDevById(id),
    appDevService.getAppDevById(id),
    iotDevService.getIotDevById(id),
  ]);

  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = compe.length; i < j; ++i) {
    if (compe[i]) return [compe[i], i];
  }
  return [null, -1];
};

/**
 * Get competition by userId
 * @param {ObjectId} id - User Id
 * @returns {Promise<Array<Olim|GameDev|AppDev|IotDev|null, number>>}
 */
const getCompeByUserId = async (id) => {
  const compe = await Promise.all([
    olimService.getOlimByUserId(id),
    gameDevService.getGameDevByUserId(id),
    appDevService.getAppDevByUserId(id),
    iotDevService.getIotDevByUserId(id),
  ]);

  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = compe.length; i < j; ++i) {
    if (compe[i]) return [compe[i], i];
  }
  return [null, -1];
};

/**
 * Get competition by nama tim
 * @param {string} namaTim - Nama Tim
 * @returns {Promise<Array<Olim|GameDev|AppDev|IotDev|null, number>>}
 */
const getCompeByNamaTim = async (namaTim) => {
  const compe = await Promise.all([
    olimService.getOlimByNamaTim(namaTim),
    gameDevService.getGameDevByNamaTim(namaTim),
    appDevService.getAppDevByNamaTim(namaTim),
    iotDevService.getIotDevByNamaTim(namaTim),
  ]);

  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = compe.length; i < j; ++i) {
    if (compe[i]) return [compe[i], i];
  }
  return [null, -1];
};

/**
 * Toggle verif by any competition id
 * @param {ObjectId} compeId
 * @returns {Promise<Olim|GameDev|AppDev|IotDev>}
 */
const toggleVerif = async (compeId) => {
  const [compe, index] = await getCompeById(compeId);
  if (!compe || index === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  return compeToggleVerif[index](compeId, compe);
};

const compeQuery = {
  olim: olimService.queryOlims,
  gamedev: gameDevService.queryGameDevs,
  appdev: appDevService.queryAppDevs,
  iotdev: iotDevService.queryIotDevs,
};

/**
 * Download CSV
 * @param {string} compe
 * @returns {Promise<string>}
 */
const downloadCsv = async (compe) => {
  const { results } = await compeQuery[compe]({}, { limit: 69420 });
  const cleanResults = results.map((result) => {
    const { __v, _id, ...cleanResult } = result.toObject();
    return cleanResult;
  });
  return parseAsync(cleanResults);
};

const compeUpdate = {
  gamedev: gameDevService.updateGameDevByUserId,
  appdev: appDevService.updateAppDevByUserId,
  iotdev: iotDevService.updateIotDevByUserId,
};

/**
 * Submit karya
 * @param {Object} user
 * @param {string} linkKaryaDanVideo
 * @returns {Promise<GameDev|AppDev|IotDev>}
 */
const submitKarya = async (user, linkKaryaDanVideo) => {
  if (!user.registeredComp || user.registeredComp === 'olim') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User tidak terdaftar di Development Competition!');
  }
  return compeUpdate[user.registeredComp](user.id, { linkKaryaDanVideo });
};

module.exports = {
  multiUploads,
  pay,
  toggleVerif,
  queryCompetitions,
  getCompeById,
  getCompeByUserId,
  getCompeByNamaTim,
  downloadCsv,
  submitKarya,
};
