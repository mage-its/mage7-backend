const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const gameDevSchema = mongoose.Schema(
  {
    kategori: {
      type: String,
      required: true,
      enum: ['Siswa', 'Mahasiswa'],
    },
    noPeserta: {
      type: String,
      required: true,
      index: true,
    },
    namaPembimbing: {
      type: String,
      required: true,
      trim: true,
    },
    hpPembimbing: {
      type: String,
      required: true,
    },
    waPembimbing: {
      type: String,
      required: true,
    },
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
    },
    namaAnggota1: {
      type: String,
      trim: true,
      default: null,
    },
    namaAnggota2: {
      type: String,
      trim: true,
      default: null,
    },
    pathIdentitasAnggota1: {
      type: String,
      default: null,
    },
    pathIdentitasAnggota2: {
      type: String,
      default: null,
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
      default: null,
    },
    asalKota: {
      type: String,
      required: true,
    },
    asalInfo: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    pathBuktiBayar: {
      type: String,
      default: null,
    },
    statusBayar: {
      type: String,
      enum: ['Not Verified', 'Verified'],
      default: 'Not Verified',
    },
    pathProposal: {
      type: String,
      default: null,
    },
    tahap: {
      type: Number,
      default: 1,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
gameDevSchema.plugin(toJSON);
gameDevSchema.plugin(paginate);

/**
 * @typedef GameDev
 */
const GameDev = mongoose.model('GameDev', gameDevSchema);

module.exports = GameDev;
