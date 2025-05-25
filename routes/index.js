var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
    const themes = await global.db.getThemes();
    
    res.render('index', { 
        title: 'Quizzes',
        themes: themes
    });
});

router.get('/login', function(req, res, next) {
    res.render('cadastro_login', { title: 'Quizzes', formType: 'login' });
});

router.post('/login', async function(req, res, next) {
    const { email, password } = req.body;
    const user = await global.db.login(email, password);

    if (user.error) {
        return res.render('cadastro_login', {
            title: 'Quizzes', 
            formType: 'login', 
            error: user.error
        });
    }

    req.session.user = {
        id: user.id,
        email: user.email,
        username: user.username
    };

    res.redirect('/');
});

router.get('/register', function(req, res, next) {
    res.render('cadastro_login', { title: 'Quizzes', formType: 'register' });
});

router.post('/register', async function(req, res, next) {
    const result = await global.db.register(req.body);

    if (result.error) {
        return res.render('cadastro_login', {
            title: 'Quizzes',
            formType: 'register',
            error: result.error
        });
    }

    res.redirect('/login');
});

module.exports = router;