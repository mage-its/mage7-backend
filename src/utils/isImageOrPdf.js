const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');

const isImageOrPdf = (file, cb) => {
  // Allowed ext
  const filetypes = /(?:jp(?:eg|g)|p(?:df|ng))$/; // /jpeg|jpg|png|pdf/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new ApiError(httpStatus.BAD_REQUEST, 'Please upload an Image or PDF'));
};

const isPdf = (file, cb) => {
  // Allowed ext
  const filetypes = /pdf$/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new ApiError(httpStatus.BAD_REQUEST, 'Please upload a PDF'));
};

module.exports = {
  isImageOrPdf,
  isPdf,
};
