import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
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
const debug = require('debug')('testapp:server');
const app  = express();


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log('app running on',port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
		break;
	default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}



//Express Production Security Practice - use generic cookie names 
app.set('trust proxy', 1); 

app.use(expressSession({
	secret: 'quosdhfg',
	name: 'sessionId'
}));


//Express Production Security Practice
app.use(helmet());


// get our request parameters
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

// log to console
app.use(morgan('dev'));

app.use(cors());
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





