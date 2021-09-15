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
      default: null,
      trim: true,
    },
    hpPembimbing: {
      type: String,
      default: null,
    },
    waPembimbing: {
      type: String,
      default: null,
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
    pathBuktiUploadTwibbon: {
      type: String,
      required: true,
    },
    pathBuktiFollowMage: {
      type: String,
      required: true,
    },
    pathBuktiRepostStory: {
      type: String,
      required: true,
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
    pathProposal: {
      type: String,
      default: null,
    },
    linkKaryaDanVideo: {
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
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
gameDevSchema.plugin(toJSON);
gameDevSchema.plugin(paginate);

gameDevSchema.pre('save', async function (next) {
  const gameDev = this;
  gameDev.sudahUploadBuktiBayar = !!gameDev.pathBuktiBayar && !!gameDev.namaBayar;
  next();
});

/**
 * @typedef GameDev
 */
const GameDev = mongoose.model('GameDev', gameDevSchema);

module.exports = GameDev;
