const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const iotDevValidation = require('../../validations/iotDev.validation');
const iotDevController = require('../../controllers/iotDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const removeEmpty = require('../../middlewares/removeEmpty');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');

const router = express.Router();

// User route

router.post(
  '/daftar-iotdev',
  auth(),
  readForm('iotdev'),
  validate(iotDevValidation.daftarIotDev),
  removeEmpty,
  iotDevController.daftarIotDev,
  cancelFileUpload()
);

router.patch(
  '/update-profile',
  auth(),
  form,
  validate(iotDevValidation.updateProfile),
  removeEmpty,
  iotDevController.updateProfile
);

router.post('/upload-proposal', auth(), readForm('iotdevProposal'), iotDevController.uploadProposal);

// Admin route

router.get('/', auth('getUsers'), validate(iotDevValidation.getIotDevs), iotDevController.getIotDevs);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('iotdev'),
  validate(iotDevValidation.createIotDev),
  removeEmpty,
  iotDevController.createIotDev,
  cancelFileUpload()
);

router
  .route('/:iotDevId')
  .get(auth('getUsers'), validate(iotDevValidation.getIotDev), iotDevController.getIotDev)
  .patch(auth('manageUsers'), form, validate(iotDevValidation.updateIotDev), removeEmpty, iotDevController.updateIotDev)
  .delete(auth('manageUsers'), validate(iotDevValidation.deleteIotDev), iotDevController.deleteIotDev);

router.post(
  '/toggle-verif/:iotDevId',
  auth('manageUsers'),
  validate(iotDevValidation.toggleVerif),
  iotDevController.toggleVerif
);

module.exports = router;
