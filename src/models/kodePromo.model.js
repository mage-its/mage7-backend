const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const kodePromoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
      enum: ['olim', 'gdevm', 'adevm', 'idev', 'gdevs', 'adevs'],
    },
    no: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
kodePromoSchema.plugin(toJSON);
kodePromoSchema.plugin(paginate);

/**
 * @typedef KodePromo
 */
const kodePromo = mongoose.model('KodePromo', kodePromoSchema);

module.exports = kodePromo;
