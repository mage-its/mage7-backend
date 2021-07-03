const Joi = require('joi').extend(require('joi-phone-number'));
const { objectId } = require('./custom.validation');

const daftarIotDev = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30).required(),
      namaPembimbing: Joi.string().trim().min(1).max(100),
      hpPembimbing: Joi.string().trim().min(1).max(30),
      waPembimbing: Joi.string().trim().min(1).max(30),
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
      namaPembimbing: Joi.string().trim().min(1).max(100),
      hpPembimbing: Joi.string().trim().min(1).max(30),
      waPembimbing: Joi.string().trim().min(1).max(30),
      namaKetua: Joi.string().trim().min(1).max(100),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      lineKetua: Joi.string().min(1).max(100),
      namaAnggota1: Joi.string().trim().min(1).max(100),
      namaAnggota2: Joi.string().trim().min(1).max(100),
      asalInstansi: Joi.string().trim().min(1).max(100),
      alamatInstansi: Joi.string().trim().min(1).max(100),
      asalKota: Joi.string().trim().min(1).max(100),
      asalInfo: Joi.string().trim().min(1).max(100),
    })
    .min(1),
};

const createIotDev = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30).required(),
      namaPembimbing: Joi.string().trim().min(1).max(100),
      hpPembimbing: Joi.string().trim().min(1).max(30),
      waPembimbing: Joi.string().trim().min(1).max(30),
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
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getIotDevs = {
  query: Joi.object().keys({
    statusBayar: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getIotDev = {
  params: Joi.object().keys({
    iotDevId: Joi.string().custom(objectId),
  }),
};

const updateIotDev = {
  params: Joi.object().keys({
    iotDevId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30),
      namaPembimbing: Joi.string().trim().min(1).max(100),
      hpPembimbing: Joi.string().trim().min(1).max(30),
      waPembimbing: Joi.string().trim().min(1).max(30),
      namaKetua: Joi.string().trim().min(1).max(100),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }),
      lineKetua: Joi.string().min(1).max(100),
      namaAnggota1: Joi.string().trim().min(1).max(100),
      namaAnggota2: Joi.string().trim().min(1).max(100),
      asalInstansi: Joi.string().trim().min(1).max(100),
      alamatInstansi: Joi.string().trim().min(1).max(100),
      asalKota: Joi.string().trim().min(1).max(100),
      asalInfo: Joi.string().trim().min(1).max(100),
      tahap: Joi.number().min(1).max(69),
      price: Joi.string().regex(/^[1-9]\d\d?\.\d{3}$/),
      statusBayar: Joi.string().trim().valid('Verified', 'Not Verified'),
    })
    .min(1),
};

const deleteIotDev = {
  params: Joi.object().keys({
    iotDevId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  daftarIotDev,
  updateProfile,
  createIotDev,
  getIotDevs,
  getIotDev,
  updateIotDev,
  deleteIotDev,
};
