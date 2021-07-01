const Joi = require('joi');

const createKodeBayar = {
  body: Joi.object().keys({
    name: Joi.string().required().valid('olim', 'gdevm', 'adevm', 'idev', 'gdevs', 'adevs'),
    no: Joi.number().integer().min(1),
    price: Joi.number().integer().min(1).required(),
  }),
};

const getKodeBayars = {
  query: Joi.object().keys({
    name: Joi.string(),
    price: Joi.number().integer().min(1),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createKodeBayar,
  getKodeBayars,
};
