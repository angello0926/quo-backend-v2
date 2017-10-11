
var express = require('express');
var router = express.Router();
var passport  = require('passport');
const subscribeController = require('../controllers/subs');

router.get('/follow/:userid', passport.authenticate('jwt', { session: false}),subscribeController.followUser);
router.get('/subs', passport.authenticate('jwt', { session: false}),subscribeController.showSubs);

module.exports = router;