import User from '../models/User';
import jwt         from 'jwt-simple';
import morgan      from 'morgan';
import mongoose    from 'mongoose';
import passport  from 'passport';
import config      from '../config/config';
import uuid        from 'node-uuid';
import aws        from 'aws-sdk';
import { validateSignUpInput } from '../validators/validator';

const s3 = new aws.S3();
mongoose.Promise = Promise;  
aws.config.update({
	credentials: new aws.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1-foo-bar'
	}),
	region: 'us-east-1'
});


function signup(req, res){
	let errors = validateSignUpInput(req.body);
	console.log(errors);
	if (!errors.isValid) {
		return res.status(400).json(errors);
	} else {
		let newUser = new User({
			email: req.body.email,
			password: req.body.password,
			profile:{ picture : 'default-propic.svg'}
		});
		// save the user
	newUser.save(function(err) {
		if (err) {
			return res.status(400).json({success: false, msg: 'Username already exists.'});
		}
		let token = jwt.encode(newUser, config.secret);
		return res.status(201).json({success: true, msg: 'Successful created new user.',token: 'JWT ' + token});
	});
	}
}


function authenticate(req, res){
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
					let token = jwt.encode(user, config.secret);
					// return the information including token as JSON
					res.status(200).json({success: true, token: 'JWT ' + token});
				} else {
					res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
				}
			});
		}
	});
}

function memberinfo(req, res){
	res.status(200).json({info: req.user});
}

function savepropic (req, res) {
	console.log(req.user);
	const unique = uuid.v1();
	const buf = new Buffer(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ''),'base64');
	const data = {
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
			const urlParams = {Bucket: 'quo-mobile', Key: unique+'.png'};
			this.s3.getSignedUrl('getObject', urlParams, function(err, url){
				req.user.profile.picture=unique+'.png';
				req.user.save();
				res.json({imrrrgurl: url, img_name: unique+'.png'});
			});
		}
	});
}


function editprofile(req, res){
	req.user.profile.name=req.body.name;
	req.user.profile.about=req.body.about;
	req.user.save();
	res.status(200).json({user: req.user});
}

export default { signup, authenticate, memberinfo, savepropic, editprofile };

