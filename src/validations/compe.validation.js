const Joi = require('joi');
const { objectId } = require('./custom.validation');

const pay = {
  body: Joi.object().keys({
    namaBayar: Joi.string().required().min(1).max(30),
  }),
};

const toggleVerif = {
  params: Joi.object().keys({
    compeId: Joi.string().custom(objectId),
  }),
};

const getCompetition = {
  params: Joi.object().keys({
    compeId: Joi.string().custom(objectId),
  }),
};

const getCompetitionByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const downloadCsv = {
  query: Joi.object().keys({
    compe: Joi.string().required().valid('olim', 'appdev', 'gamedev', 'iotdev'),
  }),
};

module.exports = {
  pay,
  toggleVerif,
  getCompetition,
  getCompetitionByUser,
  downloadCsv,
};
