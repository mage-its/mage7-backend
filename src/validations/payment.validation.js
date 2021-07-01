const Joi = require('joi');

const pay = {
  body: Joi.object().keys({
    namaBayar: Joi.string().required().min(1).max(30),
  }),
};

module.exports = {
  pay,
};
