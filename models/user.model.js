const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true },
	userName: { type: String, required: true, index: true },
	email: { type: String, required: true, index: true },
	password: { type: String, required: true, index: true },
	type: { type: String, required: true, index: true },
	avatar: { type: String }
});

module.exports = mongoose.model('User', UserSchema);