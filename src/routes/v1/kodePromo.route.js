const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const kodePromoValidation = require('../../validations/kodePromo.validation');
const kodePromoController = require('../../controllers/kodePromo.controller');

const router = express.Router();

// User route

router.post('/apply-kode', auth(), validate(kodePromoValidation.applyPromo), kodePromoController.applyKodePromo);

// Admin route

router
  .route('/')
  .post(auth('manageKodePromo'), validate(kodePromoValidation.createKodePromo), kodePromoController.createKodePromo)
  .get(auth('getKodePromo'), validate(kodePromoValidation.getKodePromos), kodePromoController.getKodePromos);

router
  .route('/:kodePromoId')
  .patch(auth('manageKodePromo'), validate(kodePromoValidation.updateKodePromo), kodePromoController.createKodePromo)
  .get(auth('getKodePromo'), validate(kodePromoValidation.getKodePromo), kodePromoController.getKodePromo)
  .delete(auth('manageKodePromo'), validate(kodePromoValidation.deleteKodePromo), kodePromoController.deleteKodePromo);

router
  .route('/kode/:kodePromo')
  .patch(
    auth('manageKodePromo'),
    validate(kodePromoValidation.updateKodePromoByKode),
    kodePromoController.updateKodePromoByKode
  )
  .get(auth('getKodePromo'), validate(kodePromoValidation.getKodePromoByKode), kodePromoController.getKodePromoByKode)
  .delete(
    auth('manageKodePromo'),
    validate(kodePromoValidation.deleteKodePromoByKode),
    kodePromoController.deleteKodePromoByKode
  );

module.exports = router;
