var express = require('express');
var auth = require('./auth');
var quizz = require('./quizz');

var router = express.Router();

router.use('/', quizz);
router.use('/auth', auth);

module.exports = router;