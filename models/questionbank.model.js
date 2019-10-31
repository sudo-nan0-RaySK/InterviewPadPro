const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const QuestionBankSchema = new mongoose.Schema({
	interviewName: { type: String, required: true, unique: true },
	quetionName: { type: String, required: true, unique: true },
	serialNumber: { type: Number, required: true, unique: true },
	testCasesPassed: { type: Number, required: true },
	score: { type: Number, required: true },
	isLast: {type:Boolean, required: true}
});

QuestionBankSchema.plugin(uniqueValidator);

module.exports = mongoose.model('QuestionBank', QuestionBankSchema);