const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'MAGE 7 API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/mage-its/mage7-backend/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
