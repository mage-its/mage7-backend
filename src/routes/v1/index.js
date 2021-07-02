const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const olimRoute = require('./olim.route');
const gameDevRoute = require('./gameDev.route');
const appDevRoute = require('./appDev.route');
const iotDevRoute = require('./iotDev.route');
const kodeBayarRoute = require('./kodeBayar.route');
const paymentRoute = require('./payment.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/olim',
    route: olimRoute,
  },
  {
    path: '/gamedev',
    route: gameDevRoute,
  },
  {
    path: '/appdev',
    route: appDevRoute,
  },
  {
    path: '/iotdev',
    route: iotDevRoute,
  },
  {
    path: '/kodebayar',
    route: kodeBayarRoute,
  },
  {
    path: '/payment',
    route: paymentRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
