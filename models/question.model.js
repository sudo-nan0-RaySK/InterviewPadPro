const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, index: true },
    timeLimit: { type: Number, required: true },
    tags: { type: String, default: "Misc" },
});

QuestionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Question', QuestionSchema);