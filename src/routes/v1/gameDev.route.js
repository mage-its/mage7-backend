const express = require('express');
const form = require('multer')().none();
const validate = require('../../middlewares/validate');
const gameDevValidation = require('../../validations/gameDev.validation');
const gameDevController = require('../../controllers/gameDev.controller');
const auth = require('../../middlewares/auth');
const readForm = require('../../middlewares/readForm');
const removeEmpty = require('../../middlewares/removeEmpty');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');
const registerBarrier = require('../../middlewares/registerBarrier');
const proposalBarrier = require('../../middlewares/proposalBarrier');

const router = express.Router();

// User route

router.post(
  '/daftar-gamedev',
  registerBarrier('devcom'),
  auth(),
  readForm('gamedev'),
  validate(gameDevValidation.daftarGameDev),
  removeEmpty,
  gameDevController.daftarGameDev,
  cancelFileUpload()
);

router.patch(
  '/update-profile',
  auth(),
  form,
  validate(gameDevValidation.updateProfile),
  removeEmpty,
  gameDevController.updateProfile
);

router.post('/upload-proposal', proposalBarrier(), auth(), readForm('gamedevProposal'), gameDevController.uploadProposal);

// Admin route

router.get('/', auth('getUsers'), validate(gameDevValidation.getGameDevs), gameDevController.getGameDevs);

router.post(
  '/:userId',
  auth('manageUsers'),
  readForm('gamedev'),
  validate(gameDevValidation.createGameDev),
  removeEmpty,
  gameDevController.createGameDev,
  cancelFileUpload()
);

router
  .route('/:gameDevId')
  .get(auth('getUsers'), validate(gameDevValidation.getGameDev), gameDevController.getGameDev)
  .patch(auth('manageUsers'), form, validate(gameDevValidation.updateGameDev), removeEmpty, gameDevController.updateGameDev)
  .delete(auth('manageUsers'), validate(gameDevValidation.deleteGameDev), gameDevController.deleteGameDev);

router.post(
  '/toggle-verif/:gameDevId',
  auth('manageUsers'),
  validate(gameDevValidation.toggleVerif),
  gameDevController.toggleVerif
);

router.post('/inc-tahap/:gameDevId', auth('manageUsers'), validate(gameDevValidation.incTahap), gameDevController.incTahap);

router.post('/dec-tahap/:gameDevId', auth('manageUsers'), validate(gameDevValidation.decTahap), gameDevController.decTahap);

module.exports = router;
