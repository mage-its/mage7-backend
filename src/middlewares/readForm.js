const { olimService, gameDevService, paymentService, appDevService } = require('../services');

const uploads = {
  olim: olimService.multiUploads,
  gamedev: gameDevService.multiUploads,
  payment: paymentService.multiUploads,
  appdev: appDevService.multiUploads,
};

const readForm = (compe) => uploads[compe];

module.exports = readForm;
