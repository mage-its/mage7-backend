const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const announcementValidation = require('../../validations/announcement.validation');
const announcementController = require('../../controllers/announcement.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(announcementValidation.createAnnouncement), announcementController.createAnnouncement)
  .get(auth('getUsers'), validate(announcementValidation.getAnnouncements), announcementController.getAnnouncements);

router.get(
  '/peserta',
  auth(),
  validate(announcementValidation.getAnnouncementsPeserta),
  announcementController.getAnnouncementsPeserta
);

router.delete(
  '/:announcementId',
  auth('manageUsers'),
  validate(announcementValidation.deleteAnnouncement),
  announcementController.deleteAnnouncement
);

module.exports = router;
