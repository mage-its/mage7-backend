const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const appDevValidation = require('../../validations/appDev.validation');
const appDevController = require('../../controllers/appDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const removeEmpty = require('../../middlewares/removeEmpty');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');
const registerBarrier = require('../../middlewares/registerBarrier');

const router = express.Router();

// User route

router.post(
  '/daftar-appdev',
  registerBarrier('devcom'),
  auth(),
  readForm('appdev'),
  validate(appDevValidation.daftarAppDev),
  removeEmpty,
  appDevController.daftarAppDev,
  cancelFileUpload()
);

router.patch(
  '/update-profile',
  auth(),
  form,
  validate(appDevValidation.updateProfile),
  removeEmpty,
  appDevController.updateProfile
);

router.post('/upload-proposal', auth(), readForm('appdevProposal'), appDevController.uploadProposal);

// Admin route

router.get('/', auth('getUsers'), validate(appDevValidation.getAppDevs), appDevController.getAppDevs);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('appdev'),
  validate(appDevValidation.createAppDev),
  removeEmpty,
  appDevController.createAppDev,
  cancelFileUpload()
);

router
  .route('/:appDevId')
  .get(auth('getUsers'), validate(appDevValidation.getAppDev), appDevController.getAppDev)
  .patch(auth('manageUsers'), form, validate(appDevValidation.updateAppDev), removeEmpty, appDevController.updateAppDev)
  .delete(auth('manageUsers'), validate(appDevValidation.deleteAppDev), appDevController.deleteAppDev);

router.post(
  '/toggle-verif/:appDevId',
  auth('manageUsers'),
  validate(appDevValidation.toggleVerif),
  appDevController.toggleVerif
);

router.post('/inc-tahap/:appDevId', auth('manageUsers'), validate(appDevValidation.incTahap), appDevController.incTahap);

router.post('/dec-tahap/:appDevId', auth('manageUsers'), validate(appDevValidation.decTahap), appDevController.decTahap);

module.exports = router;
