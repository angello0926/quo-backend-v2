
import express from 'express';
import passport  from 'passport';
import jwt from 'jwt-simple';
import { PostController } from '../controllers/postController';

export default function(){
    let router = express.Router();
    require('../config/passport')(passport);
    //Routes for creating posts
    router.post('/imageupload', passport.authenticate('jwt', { session: false}),PostController.imageupload);
    router.post('/submit', passport.authenticate('jwt', { session: false}),PostController.submission);
    
    //Get all posts
    router.get('/getallposts', passport.authenticate('jwt', { session: false}), PostController.getAllFeeds);
    
    //Get post by imgId
    router.get('/posts/:imgId', passport.authenticate('jwt', { session: false}), PostController.getPostbyImgId);
    
    //Get post bu postId
    router.get('/posts/:postId',  passport.authenticate('jwt', { session: false}), PostController.getPostByPostId)
    
    //Get user's own posts
    router.get('/getuserposts', passport.authenticate('jwt', { session: false}), PostController.getReqUserPosts);
    
    //Delete post by quote image name
    router.delete('/delete/:name', passport.authenticate('jwt', { session: false}), PostController.deletePost);
    
}
