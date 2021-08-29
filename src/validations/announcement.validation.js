const Joi = require('joi');

const createAnnouncement = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).max(500).required(),
    type: Joi.string().required().valid('olim', 'devcom', 'gamedev', 'appdev', 'iotdev', 'all', 'guest'),
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

module.exports = {
  createAnnouncement,
  getAnnouncements,
};
