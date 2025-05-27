const express = require('express');
const router = express.Router();

const auth = require('./auth');
const quizz = require('./quizz');
const session = require('express-session');

router.get('/', async function(req, res, next) {
    const themes = await global.db.getThemes();
    const quizzes = await global.db.getQuizzes();
    
    res.render('pages/home', { 
        title: 'Quizzes',
        session: req.session,
        themes: themes,
        quizzes: quizzes
    });
});

router.use('/auth', auth);
router.use('/quizz', quizz);

module.exports = router;