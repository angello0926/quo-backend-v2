
import express from 'express';
import passport  from 'passport';
import SubsController from '../controllers/subsController';

const router = express.Router();
router.get('/follow/:userid', passport.authenticate('jwt', { session: false}),SubsController.followUser);
router.get('/subs', passport.authenticate('jwt', { session: false}),SubsController.showSubs);

export default router;