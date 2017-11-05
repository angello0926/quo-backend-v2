
import express from 'express';
import passport  from 'passport';
import { SubsController } from '../controllers/subsController';

export default function(){
    let router = express.Router();
    router.get('/follow/:userid', passport.authenticate('jwt', { session: false}),SubsController.followUser);
    router.get('/subs', passport.authenticate('jwt', { session: false}),SubsController.showSubs);
    
}
