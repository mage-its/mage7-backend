const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const pengumumanValidation = require('../../validations/pengumuman.validation');
const pengumumanController = require('../../controllers/pengumuman.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(pengumumanValidation.createPengumuman), pengumumanController.createPengumuman)
  .get(auth(), validate(pengumumanValidation.getPengumumans), pengumumanController.getPengumumans);

module.exports = router;
