const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true },
	userName: { type: String, required: true, index: true, unique:true },
	email: { type: String, required: true, index: true },
	password: { type: String, required: true, index: true },
	type: { type: Number, required: true, index: true },
	avatar: { type: String }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);