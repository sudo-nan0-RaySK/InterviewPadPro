const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true }, //Will be email
	userName: { type: String, required: true, index: true, unique:true },
	password: { type: String, required: true, index: true },
	type: { type: Number, required: true, index: true },
	avatar: { type: String }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);