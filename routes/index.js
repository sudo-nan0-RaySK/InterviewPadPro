var express = require('express');
var router = express.Router();
const SanityCheck = require('../utils/sanityCheck');
const Compiler = require('../utils/compiler');
const uniqueKey = require('unique-key');
const fs = require('fs');

//Database Models
const Interview = require('../models/interview.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const QuestionBank = require('../models/questionbank.model');

/* GET home page. */
router.get('/', async function (req, res, next) {
	res.render('index', { title: 'Express' });
});

/*  POST create new Interview */
router.post('/addInterview', async (req, res, next) => {
	try {
		const name = req.body.name;
		const interviewer = req.body.interviewer;
		const candidate = req.body.candidateUsername;
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
		let gotInterviewer = await User.findOne({ name: interviewer });
		if (gotInterviewer == null) {
			throw "Association does not exist";
		}
		let gotCandidate = await User.findOne({ name: candidate });
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

/*  POST create new User */
router.post('/addUser', async (req, res, next) => {
	try {
		const { name, userName, email, password, type, avatar } = req.body;
		if (name == undefined) {
			throw "Invalid Name/ Name parameter empty"
		}
		if (userName == undefined || !SanityCheck.utils.validateUserName(userName)) {
			throw "Invalid userName/ userName parameter empty"
		}
		if (email == undefined || !SanityCheck.utils.validateEmail(email)) {
			throw "Invalid email/ email parameter empty"
		}
		if (password == undefined) {
			throw "Password parameter empty"
		}
		if (type == undefined) {
			throw "Type paramenter empty"
		}
		let savedUser = await User.create({ name, userName, email, password, type, avatar });
		res.status(200).json({
			success: true,
			message: savedUser
		})
	} catch (exception) {
		res.status(500).json({ success: false, message: exception });
	}
});

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
		//File upload
		let fileData = fs.readFileSync(questionFile.tempFilePath, 'utf-8');
		let testData = fs.readFileSync(testCaseFile.tempFilePath, 'utf-8');
		let ansData = fs.readFileSync(ansFile.tempFilePath, 'utf-8');
		fs.writeFileSync('/Users/Development/IWP_Lab/InterviewPad/static/' + title + '.html', fileData);
		fs.writeFileSync('/Users/Development/IWP_Lab/InterviewPad/static/test/' + title + '.txt', testData);
		fs.writeFileSync('/Users/Development/IWP_Lab/InterviewPad/static/ans/' + title + '.txt', ansData);

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

/* POST attempt a new Interview */
router.post('/attemptInterview/:id', async (req, res, next) => {
	try {
		const username = req.body.username;
		const password = req.body.password;

		let gotInterview = await Interview.findOne({ link: req.params['id'] });
		const candidateUsername = gotInterview.candidate;

		if (username === candidateUsername) {
			let foundUser = await User.findOne({ name: candidateUsername, password: password });
			if (foundUser === undefined) {
				throw 'Invalid password'
			} else {
				let gotQuestion = await QuestionBank.findOne({ interviewName: gotInterview.name, serialNumber: 1 });
				res.json({
					success: true,
					questionData: gotQuestion
				});
			}
		} else {
			throw "Invalid Username";
		}
	} catch (exception) {
		res.status(500).json({
			success: false,
			message: exception
		});
	}
});

/*GET next question */
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
			error: exception
		})
	}
});

/*POST compile and test code */
router.post('/compileCode', (req, res, next) => {
	try {
		const { interviewName, questionName, program, language, code } = req.body;
		const OJ = new Compiler(language, code,
			`/Users/Development/IWP_Lab/InterviewPad/static/test/` + questionName + `.txt`,
			`/Users/Development/IWP_Lab/InterviewPad/static/ans/` + questionName + `.txt`,
		);
		var userOutput = OJ.compile();
		res.json(userOutput);
	} catch (Exp) {
		res.json({ success: false, error: { message: Exp.message, stack: Exp.stack } });
	}
})

module.exports = router;
