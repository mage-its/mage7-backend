const Joi = require('joi');

const createKodeBayar = {
  body: Joi.object().keys({
    name: Joi.string().required().valid('olim', 'gdevm', 'adevm', 'idevm', 'gdevs', 'adevs'),
    no: Joi.number().integer().required(),
    price: Joi.number().integer().required(),
  }),
};

module.exports = {
  createKodeBayar,
};
