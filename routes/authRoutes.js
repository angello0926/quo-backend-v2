import express from 'express';
import { AuthController  } from '../controllers/authController';

export default function (){
    let router = express.Router();
    /* Create Account */
    router.post('/signup', AuthController.signup);
    
    /* Login */
    router.post('/authenticate', AuthController.authenticate);
    
    /*get member info */
    router.get('/memberinfo', AuthController.memberinfo);
    
}
