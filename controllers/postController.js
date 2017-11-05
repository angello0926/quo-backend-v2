
import uuid        from 'node-uuid';
import aws        from 'aws-sdk';
import mongoose    from 'mongoose';
import Post from '../models/Post';
import User from '../models/User';

export class PostController {
	constructor(){
		this.s3 = new aws.S3();
		mongoose.Promise = Promise;  
		//aws s3 config
		aws.config.update({
			credentials: new aws.CognitoIdentityCredentials({
				IdentityPoolId: 'us-east-1-foo-bar'
			}),
			region: 'us-east-1'
		});
		
	}

	
	imageupload(req, res) {
		const unique = uuid.v1();
		const buf = new Buffer(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ''),'base64');
		const data = {
			Bucket: 'quo-mobile',
			Key: unique+'.png',
			Body: buf,
			ContentEncoding: 'base64',
			ContentType: 'image/png'
		};
		this.s3.putObject(data, function(err, data){
			if (err) {
				res.status(400).send('Error uploading data: ', data);
			} else {
				const post1 = new Post({
					quote_pic:unique+'.png',
					_creator: req.user._id
				});
				post1.save();
				req.user.posts.push(post1);
				req.user.save();
				const urlParams = {Bucket: 'quo-mobile', Key: unique+'.png'};
				this.s3.getSignedUrl('getObject', urlParams, function(err, url){
					res.status(200).json({imgurl: url, img_name: unique+'.png'});
				});
			}
		});
	}
	
	
	submission (req, res) {
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
	}
	
	getAllFeeds (req, res) {
		let postFollowButton = [];
		Post
			.find({'published':true})
			.populate('_creator')
			.sort({'createdAt':-1})
			.then( 
				posts => User.findById(req.user.id, function(err, user){
				for(let i = 0; i<posts.length;i++){
					let author = posts[i]._creator._id;
					if( user.following.indexOf(author) != -1){
						postFollowButton.push('Unfollow');
					}else{
						postFollowButton.push('Follow');
					}
				}
				res.status(200).json({posts: posts, followInfo: postFollowButton});
			}))
			.catch(err => res.status(500).json({success: false, message: "Error occurs."}));
	}
	
	getPostbyImgId(req, res) {
		Post
			.find({'quote_pic':req.params.imgId})
			.populate('_creator')
			.exec(function (err, entry) {
				if(entry)
				res.status(200).json({post: entry});
			});
	
	}
	
	getPostByPostId(req, res) {
		Post
			.find({'_id':req.postId})
			.populate('_creator')
			.then( entry => res.status(200).json({post: entry}))
			.catch( err => {
				res.status(500).json({success: false, message: "Error occurs."});
			});
	
	}
	
	
	getReqUserPosts (req, res) {
		const arraypost = req.user.posts;
		const num_p = arraypost.length;
		const following = req.user.following;
		const num_f = following.length;
		const followers = req.user.followers;
		const num_ff = followers.length;
	
		Post
			.find({'_creator': req.user._id})
			.sort({'createdAt':-1})
			.then( 
				posts => {res.json({ userInfo: { pic: req.user.profile.picture, name: req.user.profile.name},
					posts: posts , postno: num_p , subscribe: num_f , followers: num_ff});
			})
			.catch(err => res.status(500).json({success: false, message: "Error occurs."}));
	}
	
	deletePost (req, res) {
		const quoteFilename = req.params.name;
		Post
			.findOne({'quote_pic': quoteFilename })
			.then( post => {
				const objid = post._id;
				User.update({ _id: req.user.id }, {$pullAll: {posts: [objid ]}}).exec(function(err,data){
					post.remove();
					res.send('success');
				});
			})
			.catch(err => {
				err.status(500).json({success: false, message: "Error occurs."});	
			});
	}
}
