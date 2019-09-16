const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

const InterviewSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    interviewer: { type: String, required: true, index: true },
    description: { type: String, required: true }
});

InterviewSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Interview", InterviewSchema);