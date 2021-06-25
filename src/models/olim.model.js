const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const olimSchema = mongoose.Schema(
  {
    namaTim: {
      type: String,
      required: true,
      trim: true,
    },
    namaKetua: {
      type: String,
      required: true,
      trim: true,
    },
    hpKetua: {
      type: String,
      required: true,
      trim: true,
    },
    waKetua: {
      type: String,
      required: true,
      trim: true,
    },
    lineKetua: {
      type: String,
      required: true,
      trim: true,
    },
    pathIdentitasKetua: {
      type: String,
      required: true,
      private: true,
    },
    namaAnggota1: {
      type: String,
      required: true,
      trim: true,
    },
    namaAnggota2: {
      type: String,
      required: true,
      trim: true,
    },
    pathIdentitasAnggota1: {
      type: String,
      required: true,
    },
    pathIdentitasAnggota2: {
      type: String,
      required: true,
    },
    asalInstansi: {
      type: String,
      required: true,
      trim: true,
    },
    alamatInstansi: {
      type: String,
      required: true,
      trim: true,
    },
    pathSuratKeteranganSiswa: {
      type: String,
      required: true,
    },
    asalInfo: {
      type: String,
      required: true,
    },
    pathBuktiBayar: {
      type: String,
      default: '',
    },
    statusBayar: {
      type: String,
      enum: ['Not Verified', 'Verified'],
      default: 'Not Verified',
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
olimSchema.plugin(toJSON);
olimSchema.plugin(paginate);

/**
 * @typedef Olim
 */
const Olim = mongoose.model('Olim', olimSchema);

module.exports = Olim;
