const { olimService, gameDevService, paymentService, appDevService, iotDevService } = require('../services');

const uploads = {
  olim: olimService.multiUploads,
  gamedev: gameDevService.multiUploads,
  appdev: appDevService.multiUploads,
  iotdev: iotDevService.multiUploads,
  gamedevProposal: gameDevService.multerProposal,
  appdevProposal: appDevService.multerProposal,
  iotdevProposal: iotDevService.multerProposal,
  payment: paymentService.multiUploads,
};

const readForm = (key) => uploads[key];

module.exports = readForm;
