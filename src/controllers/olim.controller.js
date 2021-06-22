const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, olimService } = require('../services');

const daftarOlim = catchAsync(async (req, res) => {
  await userService.checkEmailVerification(req.user.id);
  await userService.isRegistered(req.user.id);
  req.olim = await olimService.daftarOlim(req.body, req.user);
  const olim = await olimService.simpanDataOlim(req);
  res.status(httpStatus.CREATED).send({ olim });
});

const readForm = () => olimService.multiUploads;

const handleError = async (err, req, _res, next) => {
  await olimService.removeFileErr(req.files);
  next(err);
};

module.exports = {
  daftarOlim,
  readForm,
  handleError,
};
