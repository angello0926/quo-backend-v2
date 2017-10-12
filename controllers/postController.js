
var uuid        = require('node-uuid');
var aws        = require('aws-sdk');
var mongoose    = require('mongoose');
const s3 = new aws.S3();
const Post = require('../models/post');
const User = require('../models/User');
mongoose.Promise = Promise;  
//aws s3 config
aws.config.update({
	credentials: new aws.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1-foo-bar'
	}),
	region: 'us-east-1'
});


exports.imageupload = (req, res) => {
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
			res.status(400).send('Error uploading data: ', data);
		} else {
			var post1 = new Post({
				quote_pic:unique+'.png',
				_creator: req.user._id
			});
			post1.save();
			req.user.posts.push(post1);
			req.user.save();
			var urlParams = {Bucket: 'quo-mobile', Key: unique+'.png'};
			s3.getSignedUrl('getObject', urlParams, function(err, url){
				res.status(200).json({imgurl: url, img_name: unique+'.png'});
			});
		}
	});
};


exports.submission = (req, res) => {
	User
		.findOne({'_id': req.user.id})
		.populate('posts')
		.then( 
			user => Post.findOne({ quote_pic: req.body.img_name}, function (err, doc){
				doc.captions = req.body.postContent.caption;
				doc.author = req.body.postContent.author;
				doc.title = req.body.postContent.title;
				doc.published = true;
				doc.save();
				res.status(200).send('success');
			})
		)
		.catch(err => res.status(500).json({success: false, message: "Error occurs."}));
};

exports.getAllFeeds = (req, res) => {
	var postFollowButton = [];
	Post
		.find({'published':true})
		.populate('_creator')
		.sort({'createdAt':-1})
		.then( 
			posts => User.findById(req.user.id, function(err, user){
			for(var i = 0; i<posts.length;i++){
				var author = posts[i]._creator._id;
				if( user.following.indexOf(author) != -1){
					postFollowButton.push('Unfollow');
				}else{
					postFollowButton.push('Follow');
				}
			}
			res.status(200).json({posts: posts, followInfo: postFollowButton});
		}))
		.catch(err => res.status(500).json({success: false, message: "Error occurs."}));
};

exports.getPostbyImgId= (req, res) => {
	Post
		.find({'quote_pic':req.params.imgId})
		.populate('_creator')
		.exec(function (err, entry) {
			if(entry)
			res.status(200).json({post: entry});
		});

};

exports.getPostByPostId= (req, res) => {
	Post
		.find({'_id':req.postId})
		.populate('_creator')
		.then( entry => res.status(200).json({post: entry}))
		.catch( err => {
			res.status(500).json({success: false, message: "Error occurs."})
		});

};


exports.getReqUserPosts = (req, res) => {
	var arraypost = req.user.posts;
	var num_p = arraypost.length;
	var following = req.user.following;
	var num_f = following.length;
	var followers = req.user.followers;
	var num_ff = followers.length;

	Post
		.find({'_creator': req.user._id})
		.sort({'createdAt':-1})
		.then( 
			posts => {res.json({ userInfo: { pic: req.user.profile.picture, name: req.user.profile.name},
				posts: posts , postno: num_p , subscribe: num_f , followers: num_ff});
		})
		.catch(err => res.status(500).json({success: false, message: "Error occurs."}));
};

exports.deletePost = (req, res) => {
	var quoteFilename = req.params.name;
	Post
		.findOne({'quote_pic': quoteFilename })
		.then( post => {
			var objid = post._id;
			User.update({ _id: req.user.id }, {$pullAll: {posts: [objid ]}}).exec(function(err,data){
				post.remove();
				res.send('success');
			});
		})
		.catch(err => {
			es.status(500).json({success: false, message: "Error occurs."});	
		});
};