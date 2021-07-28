const Joi = require('joi');
const { objectId } = require('./custom.validation');

const pay = {
  body: Joi.object().keys({
    namaBayar: Joi.string().required().min(1).max(30),
  }),
};

const toggleVerif = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  pay,
  toggleVerif,
};
