const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, kodePromoService } = require('../services');

const createKodePromo = catchAsync(async (req, res) => {
  const kodePromo = await kodePromoService.createKodePromo(req.body);
  res.status(httpStatus.CREATED).send(kodePromo);
});

const getKodePromos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['kode', 'category', 'active']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await kodePromoService.queryKodePromos(filter, options);
  res.send(result);
});

const getKodePromo = catchAsync(async (req, res) => {
  const kodePromo = await kodePromoService.getKodePromoById(req.params.kodePromoId);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KodePromo not found');
  }
  res.send(kodePromo);
});

const getKodePromoByKode = catchAsync(async (req, res) => {
  const kodePromo = await kodePromoService.getKodePromoByKode(req.params.kodePromo);
  if (!kodePromo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KodePromo not found');
  }
  res.send(kodePromo);
});

const updateKodePromo = catchAsync(async (req, res) => {
  const kodePromo = await kodePromoService.updateKodePromoById(req.params.kodePromoId, req.body);
  res.send(kodePromo);
});

const updateKodePromoByKode = catchAsync(async (req, res) => {
  const kodePromo = await kodePromoService.updateKodePromoByKode(req.params.kodePromo, req.body);
  res.send(kodePromo);
});

const deleteKodePromo = catchAsync(async (req, res) => {
  await kodePromoService.deleteKodePromoById(req.params.kodePromoId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteKodePromoByKode = catchAsync(async (req, res) => {
  await kodePromoService.deleteKodePromoByKode(req.params.kodePromo);
  res.status(httpStatus.NO_CONTENT).send();
});

const applyKodePromo = catchAsync(async (req, res) => {
  const { user, compe } = await userService.getProfile(req.user.id);
  const result = await kodePromoService.applyPromo(req.body.kode, user, compe);
  res.send(result);
});

module.exports = {
  createKodePromo,
  getKodePromos,
  getKodePromo,
  getKodePromoByKode,
  updateKodePromo,
  updateKodePromoByKode,
  deleteKodePromo,
  deleteKodePromoByKode,
  applyKodePromo,
};
