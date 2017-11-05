import mongoose from 'mongoose';
import User  from '../models/User';
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
	captions:  { type: String, default: '' },
	quote_pic: '',
	author : { type: String, default: '' },
	title:  { type: String, default: '' },
	tags:  [{ type: String, default: '' }],
	_creator: { type: Schema.ObjectId, ref: 'User' },
	bookmarked : [{ type: Schema.ObjectId, ref: 'User' }],
	published: false
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
