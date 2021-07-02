const { olimService, gameDevService, paymentService, appDevService, iotDevService } = require('../services');

const uploads = {
  olim: olimService.multiUploads,
  gamedev: gameDevService.multiUploads,
  payment: paymentService.multiUploads,
  appdev: appDevService.multiUploads,
  iotdev: iotDevService.multiUploads,
};

const readForm = (compe) => uploads[compe];

module.exports = readForm;
