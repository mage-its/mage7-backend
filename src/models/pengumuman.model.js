const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const pengumumanSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['olim', 'devcom', 'gamedev', 'appdev', 'iotdev', 'guest'],
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
pengumumanSchema.plugin(toJSON);
pengumumanSchema.plugin(paginate);

/**
 * @typedef Pengumuman
 */
const Pengumuman = mongoose.model('Pengumuman', pengumumanSchema);

module.exports = Pengumuman;
