const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const olimSchema = mongoose.Schema(
  {
    noPeserta: {
      type: String,
      required: true,
      index: true,
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
    sudahUploadBuktiBayar: {
      type: Boolean,
      default: false,
    },
    namaBayar: {
      type: String,
      default: null,
    },
    pathBuktiBayar: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    usedPromo: {
      type: Boolean,
      default: false,
    },
    kodePromo: {
      type: String,
      default: null,
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
olimSchema.plugin(toJSON);
olimSchema.plugin(paginate);

olimSchema.pre('save', async function (next) {
  const olim = this;
  olim.sudahUploadBuktiBayar = !!olim.pathBuktiBayar && !!olim.namaBayar;
  next();
});

/**
 * @typedef Olim
 */
const Olim = mongoose.model('Olim', olimSchema);

module.exports = Olim;
