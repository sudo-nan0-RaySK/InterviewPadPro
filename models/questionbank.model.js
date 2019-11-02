const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const QuestionBankSchema = new mongoose.Schema({
	interviewName: { type: String, required: true, unique: true },
	interviewer: { type: String, required: true, unique: true },
	questionName: { type: String, required: true },
	serialNumber: { type: Number, required: true },
	score: { type: Number, required: true },
	isLast: { type: Boolean, required: true }
});

module.exports = mongoose.model('QuestionBank', QuestionBankSchema);