const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true, index: true },
    timeLimit: { type: Number, required: true },
    description: { type: String, required: true }, //HTML Pages in S3
    testCases: { type: String, required: true }, //Text files in S3
    tags: { type: String, required: true }
});

module.exports = mongoose.model('Question',QuestionSchema);