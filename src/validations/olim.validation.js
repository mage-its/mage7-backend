const Joi = require('joi').extend(require('joi-phone-number'));
const { objectId } = require('./custom.validation');

const daftarOlim = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30).required(),
      namaKetua: Joi.string().trim().min(1).max(100).required(),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      lineKetua: Joi.string().required().min(1).max(100),
      namaAnggota1: Joi.string().trim().min(1).max(100),
      namaAnggota2: Joi.string().trim().min(1).max(100),
      asalInstansi: Joi.string().trim().min(1).max(100).required(),
      alamatInstansi: Joi.string().trim().min(1).max(100).required(),
      asalKota: Joi.string().trim().min(1).max(100).required(),
      asalInfo: Joi.string().trim().min(1).max(100).required(),
    })
    .with('namaAnggota2', 'namaAnggota1'),
};

const updateProfile = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30),
      namaKetua: Joi.string().trim().min(1).max(100),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      lineKetua: Joi.string(),
      namaAnggota1: Joi.string().trim().min(1).max(100),
      namaAnggota2: Joi.string().trim().min(1).max(100),
      asalInstansi: Joi.string().trim().min(1).max(100),
      alamatInstansi: Joi.string().trim().min(1).max(100),
      asalKota: Joi.string().trim().min(1).max(100),
      asalInfo: Joi.string().trim().min(1).max(100),
    })
    .min(1),
};

const createOlim = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30).required(),
      namaKetua: Joi.string().trim().min(1).max(100).required(),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      lineKetua: Joi.string().required(),
      namaAnggota1: Joi.string().trim().min(1).max(100),
      namaAnggota2: Joi.string().trim().min(1).max(100),
      asalInstansi: Joi.string().trim().min(1).max(100).required(),
      alamatInstansi: Joi.string().trim().min(1).max(100).required(),
      asalKota: Joi.string().trim().min(1).max(100).required(),
      asalInfo: Joi.string().trim().min(1).max(100).required(),
    })
    .with('namaAnggota2', 'namaAnggota1'),
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getOlims = {
  query: Joi.object().keys({
    statusBayar: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOlim = {
  params: Joi.object().keys({
    olimId: Joi.string().custom(objectId),
  }),
};

const updateOlim = {
  params: Joi.object().keys({
    olimId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30),
      namaKetua: Joi.string().trim().min(1).max(100),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      lineKetua: Joi.string(),
      namaAnggota1: Joi.string().trim().min(1).max(100),
      namaAnggota2: Joi.string().trim().min(1).max(100),
      asalInstansi: Joi.string().trim().min(1).max(100),
      alamatInstansi: Joi.string().trim().min(1).max(100),
      asalKota: Joi.string().trim().min(1).max(100),
      asalInfo: Joi.string().trim().min(1).max(100),
      price: Joi.string().regex(/^[1-9]\d\d?\.\d{3}$/),
      statusBayar: Joi.string().trim().valid('Verified', 'Not Verified'),
    })
    .min(1),
};

const deleteOlim = {
  params: Joi.object().keys({
    olimId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  daftarOlim,
  updateProfile,
  createOlim,
  getOlims,
  getOlim,
  updateOlim,
  deleteOlim,
};
