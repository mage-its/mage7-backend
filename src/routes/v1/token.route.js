const express = require('express');
const auth = require('../../middlewares/auth');
const tokenController = require('../../controllers/token.controller');

const router = express.Router();

router.delete('/refresh', auth('manageUsers'), tokenController.deleteRefreshTokens);

module.exports = router;
