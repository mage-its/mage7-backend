const removeEmpty = (req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  req.body = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v !== null && v !== undefined && v !== ''));

  return next();
};

module.exports = removeEmpty;
