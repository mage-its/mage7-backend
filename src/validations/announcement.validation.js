const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAnnouncement = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).max(2500).required(),
    type: Joi.string().required().valid('olim', 'devcom', 'gamedev', 'appdev', 'iotdev', 'all', 'guest', 'namatim'),
    namaTim: Joi.string(),
  }),
};

const getAnnouncements = {
  query: Joi.object().keys({
    type: Joi.string().valid('olim', 'devcom', 'gamedev', 'appdev', 'iotdev', 'all', 'guest'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAnnouncementsPeserta = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteAnnouncement = {
  params: Joi.object().keys({
    announcementId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementsPeserta,
  deleteAnnouncement,
};
