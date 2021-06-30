const { olimService, gameDevService, paymentService } = require('../services');

const uploads = {
  olim: olimService.multiUploads,
  gamedev: gameDevService.multiUploads,
  payment: paymentService.multiUploads,
};

const readForm = (compe) => uploads[compe];

module.exports = readForm;
