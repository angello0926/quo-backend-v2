const User = require('../models/User');
var jwt         = require('jwt-simple');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport  = require('passport');
var config      = require('../config/config');
var uuid        = require('node-uuid');
var aws        = require('aws-sdk');
const s3 = new aws.S3();

aws.config.update({
	credentials: new aws.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1-foo-bar'
	}),
	region: 'us-east-1'
});


exports.signup = (req, res) => {
	if (!req.body.email || !req.body.password) {
		res.status(400).json({success: false, msg: 'Please pass email and password.'});
	} else {
		var newUser = new User({
			email: req.body.email,
			password: req.body.password,
			profile:{ picture : 'default-propic.svg'}
		});

		// save the user
		newUser.save(function(err) {
			if (err) {
				return res.status(400).json({success: false, msg: 'Username already exists.'});
			}
			var token = jwt.encode(newUser, config.secret);
			res.status(201).json({success: true, msg: 'Successful created new user.',token: 'JWT ' + token});
		});
	}
};


exports.authenticate = (req, res) => {
	User.findOne({
		email: req.body.email
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
		} else {
			// check if password matches
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
					// if user is found and password is right create a token
					var token = jwt.encode(user, config.secret);
					// return the information including token as JSON
					res.status(200).json({success: true, token: 'JWT ' + token});
				} else {
					res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
				}
			});
		}
	});
};

exports.memberinfo = (req, res) =>{
	res.status(200).json({info: req.user});
};

exports.savepropic = (req, res) =>{
	console.log(req.user);
	var unique = uuid.v1();
	var buf = new Buffer(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ''),'base64');
	var data = {
		Bucket: 'quo-mobile',
		Key: unique+'.png',
		Body: buf,
		ContentEncoding: 'base64',
		ContentType: 'image/png'
	};
	s3.putObject(data, function(err, data){
		if (err) {
			res.send('savePropic error');
		} else {
			var urlParams = {Bucket: 'quo-mobile', Key: unique+'.png'};
			s3.getSignedUrl('getObject', urlParams, function(err, url){
				req.user.profile.picture=unique+'.png';
				req.user.save();
				res.json({imgurl: url, img_name: unique+'.png'});
			});
		}
	});
};


exports.editprofile = (req, res) => {
	req.user.profile.name=req.body.name;
	req.user.profile.about=req.body.about;
	req.user.save();
	res.status(200).json({user: req.user});
};