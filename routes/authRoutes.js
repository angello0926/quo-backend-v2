var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

/* Create Account */
router.post('/signup', authController.signup);

/* Login */
router.post('/authenticate', authController.authenticate);

/*get member info */
router.get('/memberinfo', authController.memberinfo);
module.exports = router;
