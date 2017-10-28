import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// load up the user model
import User  from '../models/User';
import config  from '../config/config'; // get db config file

module.exports = function(passport) {
	
	var opts = {};
	opts.secretOrKey = config.secret;

	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		console.log(jwt_payload, 'dfsfdsfdfdsfdsf');
		User.findOne({email: jwt_payload.email}, function(err, user) {
			if (err) {
				console.log('cant auth');
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