const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const appDevValidation = require('../../validations/appDev.validation');
const appDevController = require('../../controllers/appDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');

const router = express.Router();

// User route

router.post(
  '/daftar-appdev',
  auth(),
  readForm('appdev'),
  validate(appDevValidation.daftarAppDev),
  appDevController.daftarAppDev,
  cancelFileUpload()
);

router.patch('/update-profile', auth(), form, validate(appDevValidation.updateProfile), appDevController.updateProfile);

router.post('/upload-proposal', auth(), readForm('appdevProposal'), appDevController.uploadProposal);

// Admin route

router.get('/', auth('getUsers'), validate(appDevValidation.getAppDevs), appDevController.getAppDevs);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('appdev'),
  validate(appDevValidation.createAppDev),
  appDevController.createAppDev,
  cancelFileUpload()
);

router
  .route('/:appDevId')
  .get(auth('getUsers'), validate(appDevValidation.getAppDev), appDevController.getAppDev)
  .patch(auth('manageUsers'), form, validate(appDevValidation.updateAppDev), appDevController.updateAppDev)
  .delete(auth('manageUsers'), validate(appDevValidation.deleteAppDev), appDevController.deleteAppDev);

module.exports = router;
