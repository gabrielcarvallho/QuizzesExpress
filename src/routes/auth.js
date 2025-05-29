const express = require('express');
const router = express.Router();

router.get('/register', function(req, res, next) {
    res.render('pages/auth', { 
        formType: 'register',
        hideHeader: true,
        skipMainCSS: true,
        skipMainJS: true,
        pageCSS: ['/stylesheets/auth.css'],
    });
});

router.post('/register', async function(req, res, next) {
    const result = await global.db.register(req.body);

    if (result.error) {
        return res.status(400).render('pages/auth', {
            formType: 'register',
            error: result.error,
            hideHeader: true,
            skipMainCSS: true,
            skipMainJS: true,
            pageCSS: ['/stylesheets/auth.css']
        });
    }

    res.redirect('/auth/login');
});

router.get('/login', function(req, res, next) {
    res.render('pages/auth', { 
        formType: 'login',
        hideHeader: true,
        skipMainCSS: true,
        skipMainJS: true,
        pageCSS: ['/stylesheets/auth.css']
    });
});

router.post('/login', async function(req, res, next) {
    const { email, password } = req.body;
    const user = await global.db.login(email, password);

    if (user.error) {
        return res.status(400).render('pages/auth', {
            formType: 'login', 
            error: user.error,
            hideHeader: true,
            skipMainCSS: true,
            skipMainJS: true,
            pageCSS: ['/stylesheets/auth.css']
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