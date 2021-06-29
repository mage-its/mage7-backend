const { olimService, gameDevService } = require('../services');

const uploads = {
  olim: olimService.multiUploads,
  gamedev: gameDevService.multiUploads,
};

const readForm = (compe) => uploads[compe];

module.exports = readForm;
