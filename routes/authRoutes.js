import  express from 'express';
let router = express.Router();

import authController from '../controllers/authController';

/* Create Account */
router.post('/signup', authController.signup);

/* Login */
router.post('/authenticate', authController.authenticate);

/*get member info */
router.get('/memberinfo', authController.memberinfo);
module.exports = router;
