const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const session = require('express-session');

router.get('/create', requireAuth, async function(req, res, next) {
    res.render('pages/createQuizz', {
        title: 'Create Quizz',
        session: req.session
    });
})

module.exports = router;