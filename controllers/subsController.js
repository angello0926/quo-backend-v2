import Post from '../models/post';
import User from '../models/User';
import mongoose from 'mongoose';

mongoose.Promise = Promise;  

exports.followUser = (req, res) => {
	User.findOne({'_id':req.user.id})
	.then( doc => {
		//search whether the user to follow is followed
		var isFollowing = doc.following.some(function (user) {
			return user.equals(req.params.userid);
		});
		if(!isFollowing){
			//add followers to the user to be followed
			User.findOneAndUpdate({'_id':req.params.userid}, {$push: { followers: req.user }}, {new: true}); 
			//add following user into the req.user
			User.findOneAndUpdate({'_id':req.user._id},{$push: { following: req.params.userid }}, {new: true},
				function(err, doc){
					res.status(200).send(false); //show unfollow button
				}
			);
		}else {
			//remove req.user from the user to be unfollow
			User.findOneAndUpdate({'_id':req.params.userid},{$pullAll: { followers:[req.user._id]}}, {new: true});
			//remove following user from the req.user's following list
			User.findOneAndUpdate({'_id':req.user._id},{$pullAll: { following: [req.params.userid]}}, {new: true}, function(err, doc){
				res.status(200).send(true); //show follow button
			});
		}
	})
	.catch( error => {
		res.status(500).send({success: false, message:'Cannot Follow User'});
	})
};


exports.showSubs = (req, res) => {
	Post
		.find({'_creator': {$in :req.user.following}})
		.populate('_creator')
		.sort({'createdAt':-1})
		.then(posts => {
			res.json({posts: posts});
		})
		.catch(error => {
			res.status(500).send({success: false, message:'Cannot show subscribed posts'});
		});
};