const express = require('express');
const validate = require('../../middlewares/validate');
const olimValidation = require('../../validations/olim.validation');
const olimController = require('../../controllers/olim.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post(
  '/daftar-olim',
  auth(),
  olimController.cekEmailDanTerdaftar,
  olimController.readForm(),
  validate(olimValidation.daftarOlim),
  olimController.daftarOlim,
  olimController.simpanDataOlim,
  olimController.handleError
);

module.exports = router;
