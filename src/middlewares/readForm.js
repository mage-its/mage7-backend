const { olimService } = require('../services');

const uploads = {
  olim: olimService.multiUploads,
};

const readForm = (compe) => uploads[compe];

module.exports = readForm;
