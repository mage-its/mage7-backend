const Joi = require('joi');

const createPengumuman = {
  body: Joi.object().keys({
    type: Joi.string().required().valid('olim', 'devcom', 'gamedev', 'appdev', 'iotdev', 'guest'),
    data: Joi.string().required(),
  }),
};

const getPengumumans = {
  query: Joi.object().keys({
    type: Joi.string().valid('olim', 'devcom', 'gamedev', 'appdev', 'iotdev', 'guest'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createPengumuman,
  getPengumumans,
};
