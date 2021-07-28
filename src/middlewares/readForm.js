const { olimService, gameDevService, compeService, appDevService, iotDevService } = require('../services');

const uploads = {
  olim: olimService.multiUploads,
  gamedev: gameDevService.multiUploads,
  appdev: appDevService.multiUploads,
  iotdev: iotDevService.multiUploads,
  gamedevProposal: gameDevService.multerProposal,
  appdevProposal: appDevService.multerProposal,
  iotdevProposal: iotDevService.multerProposal,
  payment: compeService.multiUploads,
};

const readForm = (key) => uploads[key];

module.exports = readForm;
