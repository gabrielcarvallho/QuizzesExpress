const express = require('express');
const router = express.Router();

const auth = require('./auth');
const quizz = require('./quizz');

router.get('/', async function(req, res, next) {
    const themes = await global.db.getThemes();
    const quizzes = await global.db.getQuizzes();
    
    res.render('pages/home', {
        session: req.session,
        themes: themes,
        quizzes: quizzes,
        hideHeader: false
    });
});

router.use('/auth', auth);
router.use('/quizz', quizz);

module.exports = router;