var JwtStrategy = require('passport-jwt').Strategy;

// load up the user model
var User = require('../models/User');
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
	var opts = {};
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		User.findOne({email: jwt_payload.email}, function(err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));
};