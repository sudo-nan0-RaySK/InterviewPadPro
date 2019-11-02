var express = require('express');
var router = express.Router();
const SanityCheck = require('../utils/sanityCheck');
const Compiler = require('../utils/compiler');
const uniqueKey = require('unique-key');
const fs = require('fs');
const axios = require('axios');

//Database Models
const Interview = require('../models/interview.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const QuestionBank = require('../models/questionbank.model');

/* GET home page. -> Checked*/
router.get('/', async function (req, res, next) {
	res.render('index', { title: 'Express' });
});

/*  POST create new Interview  -> Checked */
router.post('/addInterview', async (req, res, next) => {
	try {
		const name = req.body.name;
		const interviewer = req.body.interviewer;
		const candidate = req.body.candidate;
		const description = req.body.description;

		if (name == undefined || !SanityCheck.utils.validateName(name)) {
			throw "Invalid Name/ Name parameter empty"
		}
		if (interviewer == undefined) {
			throw "Interviewer parameter empty"
		}
		if (description == undefined) {
			throw "Description parameter empty"
		}
		let gotInterviewer = await User.findOne({ userName: interviewer });
		if (gotInterviewer == null) {
			throw "Association does not exist";
		}
		let gotCandidate = await User.findOne({ userName: candidate });
		if (gotCandidate == undefined) {
			throw "Candidate not found";
		}
		var link = uniqueKey();
		let saved = await Interview.create({ name, interviewer, description, link, candidate });
		res.status(200).json({
			success: true,
			message: saved
		});
	} catch (exception) {
		res.status(500).json({ success: false, message: exception });
	}
});

/*  POST create new User  -> Checked */
router.post('/addUser', async (req, res, next) => {
	try {
		const { name, userName, password, type, avatar } = req.body;
		if (name == undefined) {
			throw "Invalid Name/ Name parameter empty"
		}
		if (userName == undefined || !SanityCheck.utils.validateUserName(userName)) {
			throw "Invalid userName/ userName parameter empty"
		}
		if (password == undefined) {
			throw "Password parameter empty"
		}
		if (type == undefined) {
			throw "Type paramenter empty"
		}
		let savedUser = await User.create({ name, userName, password, type, avatar });
		res.status(200).json({
			success: true,
			message: savedUser
		})
	} catch (exception) {
		res.status(500).json({ success: false, message: exception });
	}
});

/* -> Checked */
router.post('/addQuestion', async (req, res, next) => {
	try {
		const { title, timeLimit, tags, testCases } = req.body;
		const questionFile = req.files.quesFile;
		const testCaseFile = req.files.testCaseFile;
		const ansFile = req.files.ansFile;
		let savedQues;

		if (title == undefined) {
			throw 'title parameter is empty'
		}
		if (timeLimit == undefined) {
			throw 'timeLimit parameter is empty'
		}
		if (testCases == undefined) {
			throw 'testCases parameter is empty'
		}

		console.log(questionFile.tempFilePath, testCaseFile.tempFilePath, ansFile.tempFilePath) //Debug

		fs.renameSync(questionFile.tempFilePath,
			'/Users/Development/IWP_Lab/InterviewPad/static/' + title + '.html')
		fs.renameSync(testCaseFile.tempFilePath,
			'/Users/Development/IWP_Lab/InterviewPad/static/test/' + title + '.txt')
		fs.renameSync(ansFile.tempFilePath,
			'/Users/Development/IWP_Lab/InterviewPad/static/ans/' + title + '.txt')

		if (tags === undefined)
			savedQues = await Question.create({ title, timeLimit, testCases });
		else
			savedQues = await Question.create({ title, timeLimit, tags, testCases });

		console.log(savedQues)
		res.send({
			success: true,
			message: savedQues
		});
	} catch (exception) {
		res.status(500).json({ success: false, message: exception });
	}
});

/* POST attempt a new Interview ->  Checked*/
router.post('/attemptInterview/:id', async (req, res, next) => {
	try {
		const username = req.body.username;
		const password = req.body.password;

		let gotInterview = await Interview.findOne({ link: req.params['id'] });
		const candidateUsername = gotInterview.candidate;

		if (username === candidateUsername) {
			let foundUser = await User.findOne({ userName: candidateUsername, password: password });
			if (foundUser === undefined) {
				throw 'Invalid password'
			} else {
				let gotQuestion = await QuestionBank.findOne({ interviewName: gotInterview.name, serialNumber: 1 });
				let response = await axios.post('http://localhost:3000/getQuestion', { interview: gotInterview.name, questionNumber: 1 });
				res.json(response.data)
			}
		} else {
			throw "Invalid Username";
		}
	} catch (exception) {
		res.status(500).json({
			success: false,
			message: exception.message
		});
	}
});

/*GET next question  -> Checked */
router.post('/getQuestion', async (req, res, next) => {
	const { interview, questionNumber } = req.body;
	try {
		let questionRef = await QuestionBank.findOne({ interviewName: interview, serialNumber: questionNumber });
		if (questionRef === undefined) { throw 'Question Not Found!'; }
		let gotQuestion = await Question.findOne({ title: questionRef.questionName });
		if (questionRef === undefined) { throw 'Internal server error while fetching question'; }
		res.json({
			success: true,
			questionData: gotQuestion
		});
	} catch (exception) {
		res.status(500).json({
			success: false,
			error: exception.message
		})
	}
});

/*POST compile and test code -> Checked */
router.post('/compileCode', async (req, res, next) => {
	try {
		const { interviewName, interviewer, questionName, language, code } = req.body;
		const gotQuestionBank = await QuestionBank.findOne({ interviewName: interviewName, interviewer: interviewer });
		if (gotQuestionBank === null) {
			res.status(404).json({ success: false, err: "No interview found" });
		}
		const OJ = new Compiler(language, code,
			`/Users/Development/IWP_Lab/InterviewPad/static/test/` + questionName + `.txt`,
			`/Users/Development/IWP_Lab/InterviewPad/static/ans/` + questionName + `.txt`,
		);
		var userOutput = OJ.compile();
		console.log(userOutput.score);
		let doc = await QuestionBank.findOneAndUpdate({ interviewName: interviewName, interviewer: interviewer }, { score: userOutput.score });
		console.log(doc)
		res.json(userOutput);
	} catch (Exp) {
		res.json({ success: false, error: { message: Exp.message, stack: Exp.stack } });
	}
})

/*POST add to questionSet -> Checked */
router.post('/addToQuestionSet', async (req, res, next) => {
	try {
		const { interviewName,
			userName,
			questionName,
			serialNumber,
			isLast
		} = req.body;
		let gotInterview = await Interview.findOne({
			name: interviewName,
			interviewer: userName
		});
		if (gotInterview === undefined) {
			res.status(404).json({
				success: false,
				message: "No interview found"
			});
		}
		await QuestionBank.create({
			questionName,
			interviewName,
			serialNumber,
			score: 0,
			isLast
		});
		res.json({
			success: true,
		});
	} catch (e) {
		res.json({ success: false, err: e.message })
	}
});

module.exports = router;
