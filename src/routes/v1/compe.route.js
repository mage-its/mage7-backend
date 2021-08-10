const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const readForm = require('../../middlewares/readForm');
const compeValidation = require('../../validations/compe.validation');
const compeController = require('../../controllers/compe.controller');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');

const router = express.Router();

router.get('/', auth('getUsers'), compeController.getCompetitions);

router.get('/:compeId', auth('getUsers'), validate(compeValidation.getCompetition), compeController.getCompetition);

router.post('/pay', auth(), readForm('payment'), validate(compeValidation.pay), compeController.pay, cancelFileUpload());

router.post(
  '/toggle-verif/:compeId',
  auth('manageUsers'),
  validate(compeValidation.toggleVerif),
  compeController.toggleVerif
);

module.exports = router;
