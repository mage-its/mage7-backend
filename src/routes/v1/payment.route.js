const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const readForm = require('../../middlewares/readForm');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');
const cancelFileUpload = require('../../middlewares/cancelFileUpload');

const router = express.Router();

router.post('/', auth(), readForm('payment'), validate(paymentValidation.pay), paymentController.pay, cancelFileUpload());

module.exports = router;
