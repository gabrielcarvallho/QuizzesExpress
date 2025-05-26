const express = require('express');
const router = express.Router();

router.get('/register', function(req, res, next) {
    res.render('auth', { title: 'Quizzes', formType: 'register' });
});

router.post('/register', async function(req, res, next) {
    const result = await global.db.register(req.body);

    if (result.error) {
        return res.status(400).render('auth', {
            title: 'Quizzes',
            formType: 'register',
            error: result.error
        });
    }

    res.redirect('/auth/login');
});

router.get('/login', function(req, res, next) {
    res.render('auth', { title: 'Quizzes', formType: 'login' });
});

router.post('/login', async function(req, res, next) {
    const { email, password } = req.body;
    const user = await global.db.login(email, password);

    if (user.error) {
        return res.status(400).render('auth', {
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

module.exports = router;