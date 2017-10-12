var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport  = require('passport');
var config      = require('./config/config'); // get db config file
var auth = require('./routes/authRoutes');
var posts = require('./routes/postsRoutes');
var subscribe = require('./routes/subscribeRoutes');
var helmet = require('helmet');
var expressSession = require('express-session');
var cookieSession = require('cookie-session');


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

mongoose.connect(config.database);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/subs', subscribe);


//error handling
app.use(function (err, req, res, next) {
	//console.error(err.stack)
	res.status(406).send({success: false, msg: 'Error Occurs.', error: err})
})

module.exports = app;





