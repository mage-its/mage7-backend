const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, olimService } = require('../services');

const daftarOlim = catchAsync(async (req, _res, next) => {
  const olim = await olimService.daftarOlim(req.body, req.user);
  req.olim = olim;
  next();
});

const cekEmailDanTerdaftar = catchAsync(async (req, _res, next) => {
  await userService.checkEmailVerification(req.user);
  await olimService.cekTerdaftar(req.user);
  next();
});

const readForm = () => olimService.multiUploads;

const simpanDataOlim = catchAsync(async (req, res) => {
  const olim = await olimService.simpanDataOlim(req);
  res.status(httpStatus.CREATED).send({ olim });
});

const handleError = async (err, req, _res, next) => {
  await olimService.removeFileErr(req.files);
  next(err);
};

module.exports = {
  daftarOlim,
  readForm,
  simpanDataOlim,
  cekEmailDanTerdaftar,
  handleError,
};
