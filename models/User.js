import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Post from './Post';

let Schema = mongoose.Schema;

const userSchema = new Schema({

	email: {type: String, unique:true},
	password: {type: String},
	facebook: String,
	twitter: String,
	tokens: Array,

	profile: {
		name: { type: String, default: '' },
		about: {type: String,default:''},
		picture: { type: String, default: '' }
	},

	bookmarked:[{ type: Schema.ObjectId, ref: 'Post' }],
	posts: [{ type: Schema.ObjectId, ref: 'Post' }],

	following: [{ type: Schema.ObjectId, ref: 'User' }],
	followers: [{ type: Schema.ObjectId, ref: 'User' }],

	colorpalettes:[{type: String,default:''}],

	private:{ type: Boolean, default: false }

}, { timestamps: true });


userSchema.pre('save', function (next) {
	const user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

userSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

export default mongoose.model('User', userSchema);
