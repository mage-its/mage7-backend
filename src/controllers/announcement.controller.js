const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { announcementService } = require('../services');

const createAnnouncement = catchAsync(async (req, res) => {
  const announcement = await announcementService.createAnnouncement(req.body);
  res.status(httpStatus.CREATED).send(announcement);
});

const getAnnouncements = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await announcementService.queryAnnouncements(filter, options);
  res.send(result);
});

const getAnnouncementsPeserta = catchAsync(async (req, res) => {
  const announcements = await announcementService.getAnnouncementsPeserta(req.user.registeredComp);
  res.send(announcements);
});

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementsPeserta,
};
