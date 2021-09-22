const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const announcementSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      maxLength: 2500,
    },
    type: {
      type: String,
      required: true,
      enum: ['olim', 'devcom', 'gamedev', 'appdev', 'iotdev', 'all', 'guest', 'namatim'],
    },
    namaTim: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
announcementSchema.plugin(toJSON);
announcementSchema.plugin(paginate);

/**
 * @typedef Announcement
 */
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
