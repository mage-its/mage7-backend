const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const gameDevValidation = require('../../validations/gameDev.validation');
const gameDevController = require('../../controllers/gameDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');

const router = express.Router();

// User route

router.post(
  '/daftar-gamedev',
  auth(),
  readForm('gamedev'),
  validate(gameDevValidation.daftarGameDev),
  gameDevController.daftarGameDev,
  cancelFileUpload()
);

router.patch('/update-profile', auth(), form, validate(gameDevValidation.updateProfile), gameDevController.updateProfile);

router.post('/upload-proposal', auth(), readForm('gamedevProposal'), gameDevController.uploadProposal);

// Admin route

router.get('/', auth('getUsers'), validate(gameDevValidation.getGameDevs), gameDevController.getGameDevs);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('gamedev'),
  validate(gameDevValidation.createGameDev),
  gameDevController.createGameDev,
  cancelFileUpload()
);

router
  .route('/:gameDevId')
  .get(auth('getUsers'), validate(gameDevValidation.getGameDev), gameDevController.getGameDev)
  .patch(auth('manageUsers'), form, validate(gameDevValidation.updateGameDev), gameDevController.updateGameDev)
  .delete(auth('manageUsers'), validate(gameDevValidation.deleteGameDev), gameDevController.deleteGameDev);

module.exports = router;
