var express = require('express');
var router = express.Router();
const SanityCheck = require('../utils/sanityCheck');

//Database Models
const Interview = require('../models/interview.model');
const User = require('../models/user.model');

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/*  POST create new Interview */
router.post('/addInterview', async (req, res, next) => {
  try {
    const name = req.body.name;
    const interviewer = req.body.interviewer;
    const description = req.body.description;

    if (name == undefined && !SanityCheck.utils.validateName(name)) {
      throw "Invalid Name/ Name parameter empty"
    }
    if (interviewer == undefined) {
      throw "Interviewer parameter empty"
    }
    if (description == undefined) {
      throw "Description parameter empty"
    }
    let getInterviewer = await User.findOne({ name: interviewer });
    if (getInterviewer != null) {
      throw "Association does not exist";
    }
    let saved = await Interview.create({ name, interviewer, description });
    res.status(200).json({
      success: true,
      message: saved
    })
  } catch (exception) {
    res.status(500).json({ success: false, message: exception })
  }
});

module.exports = router;
