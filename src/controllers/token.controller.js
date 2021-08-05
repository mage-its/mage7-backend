const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tokenService } = require('../services');

const deleteRefreshTokens = catchAsync(async (req, res) => {
  await tokenService.deleteRefreshTokens();
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  deleteRefreshTokens,
};
