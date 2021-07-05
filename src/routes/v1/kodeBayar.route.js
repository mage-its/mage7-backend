const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const kodeBayarValidation = require('../../validations/kodeBayar.validation');
const kodeBayarController = require('../../controllers/kodeBayar.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageKodeBayar'), validate(kodeBayarValidation.createKodeBayar), kodeBayarController.createKodeBayar)
  .get(auth('manageKodeBayar'), validate(kodeBayarValidation.getKodeBayars), kodeBayarController.getKodeBayars);

module.exports = router;
