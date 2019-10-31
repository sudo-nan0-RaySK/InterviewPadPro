var express = require('express');
var router = express.Router();
const SanityCheck = require('../utils/sanityCheck');
const uniqueKey = require('unique-key');

//Database Models
const Interview = require('../models/interview.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');

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

router.post('/addQuestion/:id', async (req, res, next) => {
	try {
		const { title, timeLimit, description, testCases, tags } = req.body;
		if (title == undefined) {
			throw 'title parameter is empty'
		}
		if (timeLimit == undefined) {
			throw 'timeLimit parameter is empty'
		}
		if (description == undefined) {
			throw 'description parameter is empty'
		}
		if (testCases == undefined) {
			throw 'title parameter is empty'
		}
		const link = req.params['id']
		let savedQues = await Question.create({ title, timeLimit, description, testCases, tags, link });
		console.log(savedQues)
		res.send({
			success: true,
			message: savedQues
		});
	} catch (exception) {
		res.status(500).json({ success: false, message: exception });
	}
});

/* GET an interview by unique link */
router.get('/getInterview/:id', async (req, res, next) => {
	try {
		let interviewDetails = await Interview.findOne({ link: req.params['id'] });
		res.status(200).json({
			success: true,
			message: interviewDetails
		});
	} catch (exception) {
		res.json({
			success: false,
			message: exception
		});
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
				//TODO replace with question bank ordering
				res.json({ success: true });
			}
		} else {
			throw "Invalid Username";
		}
	} catch (exception) {
		res.json({
			success: false,
			message: exception
		});
	}
});

module.exports = router;
