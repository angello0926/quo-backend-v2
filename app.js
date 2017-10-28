import express from 'express';
import path from 'path';
import dbConfig     from './config/config';
import bodyParser from 'body-parser';
import passport  from 'passport';
import morgan from 'morgan';
import mongoose from 'mongoose';
import auth from './routes/authRoutes';
import posts from './routes/postsRoutes';
import subscribe from './routes/subscribeRoutes';
import helmet from 'helmet';
import expressSession from 'express-session';
import cookieSession from 'cookie-session';

const app  = express();

//Express Production Security Practice - use generic cookie names 
app.set('trust proxy', 1); 

app.use(expressSession({
	secret: 'quosdhfg',
	name: 'sessionId'
}));

//Express Production Security Practice - Set cookie security options
// var expiryDate = new Date(Date.now() + 60 * 60 * 2000); // 1 hour
// app.use(cookieSession({
// 	name: 'quosession',
// 	keys: ['key1', 'key2'],
// 	cookie: {
// 		secure: true,
// 		httpOnly: true,
// 		domain: 'readnquo.com',
// 		path: 'foo/bar',
// 		expires: expiryDate
// 	}
// }));


//Express Production Security Practice
app.use(helmet());


// get our request parameters
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

app.get('/', function(req, res) {
	res.send('hello');
});

mongoose.connect(dbConfig.database);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/subs', subscribe);

//error handling
app.use(function (err, req, res, next) {
	res.status(406).send({success: false, msg: 'Error Occurs.', error: err});
});


module.exports = app;





