const Joi = require('joi');
const { objectId, urlWithProtocol } = require('./custom.validation');

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
  params: Joi.object().keys({
    compe: Joi.string().required().valid('olim', 'appdev', 'gamedev', 'iotdev'),
  }),
};

const submitKarya = {
  body: Joi.object().keys({
    linkKarya: Joi.string().custom(urlWithProtocol),
  }),
};

module.exports = {
  pay,
  toggleVerif,
  getCompetition,
  getCompetitionByUser,
  downloadCsv,
  submitKarya,
};
