const express = require('express');
const router = express.Router();

const auth = require('./auth');
const quiz = require('./quiz');
const questions = require('./questions')

router.get('/', async function(req, res, next) {
    const themes = await global.db.getThemes();
    const quizzes = await global.db.getQuizzes();
    
    res.render('pages/home', {
        themes: themes,
        quizzes: quizzes,
        hideHeader: false
    });
});

router.use('/auth', auth);
router.use('/quiz', quiz);
router.use('/questions', questions);

module.exports = router;