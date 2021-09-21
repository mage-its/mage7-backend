const httpStatus = require('http-status');
const { trusted } = require('mongoose');
const { compeService } = require('.');
const { Announcement } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an announcement
 * @param {Object} body
 * @returns {Promise<Announcement>}
 */
const createAnnouncement = async (body) => {
  if (body.namaTim && body.type !== 'namatim') {
    // eslint-disable-next-line no-param-reassign
    delete body.namaTim;
  }

  if (body.namaTim) {
    const [compe, index] = compeService.getCompeByNamaTim(body.namaTim);
    if (!compe || index === -1) {
      throw new ApiError(httpStatus.NOT_FOUND, `Tim dengan nama ${body.namaTim} tidak ditemukan`);
    }
  }

  return Announcement.create(body);
};

/**
 * Query for announcements
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAnnouncements = async (filter, options) => {
  const announcements = await Announcement.paginate(filter, options);
  return announcements;
};

/**
 * Getting announcement by type
 * @param {string} type
 * @returns {User}
 */
const getAnnouncementByType = async (type) => {
  const announcement = await Announcement.findOne({ type });
  if (!announcement) {
    throw new ApiError(httpStatus.NOT_FOUND, `Pengumuman dengan tipe ${type} tidak ditemukan`);
  }
  return announcement;
};

const announcementType = {
  olim: { $in: ['olim', 'all'] },
  appdev: { $in: ['appdev', 'devcom', 'all'] },
  gamedev: { $in: ['gamedev', 'devcom', 'all'] },
  iotdev: { $in: ['iotdev', 'devcom', 'all'] },
};

/**
 * Query for peserta announcements
 * @param {ObjectId} userId
 * @param {string} cabang
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAnnouncementsPeserta = async (userId, cabang, options) => {
  const { namaTim } = await compeService.getCompeByUserId(userId);
  return queryAnnouncements(
    { type: trusted(announcementType[cabang]), namaTim: trusted({ $in: [null, namaTim] }) },
    options
  );
};

/**
 * Delete announcement by id
 * @param {string} announcementId
 * @returns {Promise<Announcement>}
 */
const deleteAnnouncement = async (announcementId) => {
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Announcement not found');
  }
  return announcement.remove();
};

module.exports = {
  createAnnouncement,
  queryAnnouncements,
  getAnnouncementByType,
  getAnnouncementsPeserta,
  deleteAnnouncement,
};
