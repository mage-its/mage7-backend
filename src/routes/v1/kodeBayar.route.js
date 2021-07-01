const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const kodeBayarValidation = require('../../validations/kodeBayar.validation');
const kodeBayarController = require('../../controllers/kodeBayar.controller');

const router = express.Router();

router.post(
  '/',
  auth('manageKodeBayar'),
  validate(kodeBayarValidation.createKodeBayar),
  kodeBayarController.createKodeBayar
);

module.exports = router;
