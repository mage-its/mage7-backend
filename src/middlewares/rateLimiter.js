// eslint-disable-next-line import/no-unresolved
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimiter,
};
