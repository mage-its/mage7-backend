const fetch = require('node-fetch');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { recaptchaSecret, useRecaptcha } = require('../config/config');

const verifyCaptcha = async (req, res, next) => {
  if (!useRecaptcha) {
    delete req.body.recaptchaResponse;
    return next();
  }
  try {
    const { recaptchaResponse } = req.body;
    delete req.body.recaptchaResponse;

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`;
    const response = await fetch(url, { method: 'POST' });
    const googleResponse = await response.json();
    if (googleResponse.success === true) {
      return next();
    }
    return next(new ApiError(httpStatus.BAD_REQUEST, 'reCAPTCHA verification failed!'));
  } catch (e) {
    next(e);
  }
};

module.exports = verifyCaptcha;
