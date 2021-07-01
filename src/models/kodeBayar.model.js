const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const kodeBayarSchema = mongoose.Schema(
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
kodeBayarSchema.plugin(toJSON);

/**
 * @typedef KodeBayar
 */
const kodeBayar = mongoose.model('KodeBayar', kodeBayarSchema);

module.exports = kodeBayar;
