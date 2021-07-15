const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createKodePromo = {
  body: Joi.object().keys({
    kode: Joi.string().required(),
    category: Joi.string().required().valid('olim', 'devcom', 'all'),
    maxUsage: Joi.number().integer().required(),
    discountPrice: Joi.number().integer().min(1).required(),
    active: Joi.boolean(),
  }),
};

const getKodePromos = {
  query: Joi.object().keys({
    kode: Joi.string(),
    category: Joi.string().valid('olim', 'devcom', 'all'),
    active: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getKodePromo = {
  params: Joi.object().keys({
    kodePromoId: Joi.string().custom(objectId),
  }),
};

const getKodePromoByKode = {
  params: Joi.object().keys({
    kodePromo: Joi.string(),
  }),
};

const updateKodePromo = {
  params: Joi.object().keys({
    kodePromoId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      kode: Joi.string(),
      category: Joi.string().valid('olim', 'devcom', 'all'),
      maxUsage: Joi.number().integer(),
      discountPrice: Joi.number().integer().min(1),
      active: Joi.boolean(),
    })
    .min(1),
};

const updateKodePromoByKode = {
  params: Joi.object().keys({
    kodePromo: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      kode: Joi.string(),
      category: Joi.string().valid('olim', 'devcom', 'all'),
      maxUsage: Joi.number().integer(),
      discountPrice: Joi.number().integer().min(1),
      active: Joi.boolean(),
    })
    .min(1),
};

const deleteKodePromo = {
  params: Joi.object().keys({
    kodePromoId: Joi.string().custom(objectId),
  }),
};

const deleteKodePromoByKode = {
  params: Joi.object().keys({
    kodePromo: Joi.string(),
  }),
};

const applyPromo = {
  body: Joi.object().keys({
    kode: Joi.string().required(),
  }),
};

module.exports = {
  createKodePromo,
  getKodePromos,
  getKodePromo,
  getKodePromoByKode,
  updateKodePromo,
  updateKodePromoByKode,
  deleteKodePromo,
  deleteKodePromoByKode,
  applyPromo,
};
