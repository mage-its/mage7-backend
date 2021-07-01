const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
<<<<<<< HEAD
    email: Joi.string()
      .trim()
      .email({ tlds: { allow: ['com', 'net', 'org'] } })
      .required(),
    password: Joi.string().required().custom(password),
    name: Joi.string().trim().required(),
=======
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
