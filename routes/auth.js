var express = require('express');
var router = express.Router();

const authController = require('../controllers/auth');

/* Create Account */
router.post('/signup', authController.signup);

/* Login */
router.post('/authenticate', authController.authenticate);

module.exports = router;
