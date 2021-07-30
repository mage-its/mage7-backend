const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const olimRoute = require('./olim.route');
const gameDevRoute = require('./gameDev.route');
const appDevRoute = require('./appDev.route');
const iotDevRoute = require('./iotDev.route');
const pengumumanRoute = require('./pengumuman.route');
const kodeBayarRoute = require('./kodeBayar.route');
const compeRoute = require('./compe.route');
const kodePromoRoute = require('./kodePromo.route');
const tokenRoute = require('./token.route');
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
    path: '/pengumuman',
    route: pengumumanRoute,
  },
  {
    path: '/kodebayar',
    route: kodeBayarRoute,
  },
  {
    path: '/compe',
    route: compeRoute,
  },
  {
    path: '/kodepromo',
    route: kodePromoRoute,
  },
  {
    path: '/tokens',
    route: tokenRoute,
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
