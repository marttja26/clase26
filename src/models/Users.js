import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model('users', UserSchema);

export default User;
