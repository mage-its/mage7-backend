const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const kodePromoSchema = mongoose.Schema(
  {
    kode: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['olim', 'devcom', 'all'],
    },
    usage: {
      type: Number,
      default: 0,
    },
    maxUsage: {
      type: Number,
      default: 69,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
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
