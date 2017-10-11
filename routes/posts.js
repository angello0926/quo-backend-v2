
var express = require('express');
var router = express.Router();
var passport  = require('passport');
var jwt = require('jwt-simple');
require('../config/passport')(passport);

const postController = require('../controllers/post');


//Routes for creating posts
router.post('/imageupload', passport.authenticate('jwt', { session: false}),postController.imageupload);
router.post('/submit', passport.authenticate('jwt', { session: false}),postController.submission);

//routes for get home posts
router.get('/getallposts', passport.authenticate('jwt', { session: false}), postController.getAllFeeds);
router.get('/posts/:img', passport.authenticate('jwt', { session: false}), postController.getOnePost);
router.get('/getuserposts', passport.authenticate('jwt', { session: false}), postController.getReqUserPosts);
router.delete('/delete/:name', passport.authenticate('jwt', { session: false}), postController.deletePost);


module.exports = router;