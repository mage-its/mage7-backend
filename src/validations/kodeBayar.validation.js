const Joi = require('joi');

const createKodeBayar = {
  body: Joi.object().keys({
    name: Joi.string().required().valid('olim', 'gdevm', 'adevm', 'idev', 'gdevs', 'adevs'),
    no: Joi.number().integer().min(1),
    price: Joi.number().integer().min(1).required(),
  }),
};

module.exports = {
  createKodeBayar,
};
