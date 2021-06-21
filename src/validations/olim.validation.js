const Joi = require('joi').extend(require('joi-phone-number'));

const daftarOlim = {
  body: Joi.object().keys({
    namaTim: Joi.string().trim().min(1).max(30).required(),
    namaKetua: Joi.string().trim().min(1).max(100).required(),
    hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
    waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
    lineKetua: Joi.string().required(),
    namaAnggota1: Joi.string().trim().min(1).max(100).required(),
    namaAnggota2: Joi.string().trim().min(1).max(100).required(),
    asalInstansi: Joi.string().trim().min(1).max(100).required(),
    alamatInstansi: Joi.string().trim().min(1).max(100).required(),
    asalInfo: Joi.string().trim().min(1).max(100).required(),
  }),
};

module.exports = {
  daftarOlim,
};
