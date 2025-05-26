const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
    const themes = await global.db.getThemes();
    const quizzes = await global.db.getQuizzes();
    
    res.render('index', { 
        title: 'Quizzes',
        themes: themes,
        quizzes: quizzes
    });
});

module.exports = router;