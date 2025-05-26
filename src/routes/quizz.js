const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
    const themes = await global.db.getThemes();
    
    res.render('index', { 
        title: 'Quizzes',
        themes: themes
    });
});

module.exports = router;