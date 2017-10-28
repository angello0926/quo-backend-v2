
import express from 'express';
import passport  from 'passport';
import subscribeController from '../controllers/subsController';
let router = express.Router();
router.get('/follow/:userid', passport.authenticate('jwt', { session: false}),subscribeController.followUser);
router.get('/subs', passport.authenticate('jwt', { session: false}),subscribeController.showSubs);

module.exports = router;