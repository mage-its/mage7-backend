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
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { id, registeredComp } = req.user;
  const announcements = await announcementService.getAnnouncementsPeserta(id, registeredComp, options);
  res.send(announcements);
});

const deleteAnnouncement = catchAsync(async (req, res) => {
  await announcementService.deleteAnnouncement(req.params.announcementId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementsPeserta,
  deleteAnnouncement,
};
