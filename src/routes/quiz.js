const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');

router.get('/create', requireAuth, async function(req, res, next) {
    try {
        const themes = await global.db.getThemes();

        res.render('pages/createQuiz', {
            themes: themes,
            mainClass: 'main-content creator-layout',
            pageCSS: ['/stylesheets/create.css'],
        });
    } catch (error) {
        console.error('Erro interno do servidor: ', error);
        return res.status(500).send('Erro interno do servidor');
    }
})

router.post('/create', requireAuth, async function(req, res, next) {
    try {
        const { title, theme_id } = req.body;
        const created_by_id = req.session.user.id;

        const quizId = await global.db.createQuiz({
            title: title.trim(),
            theme_id: theme_id,
            created_by_id: created_by_id
        });
        
        res.redirect(`/questions/${quizId}/create`);
    } catch (error) {
        console.error('Erro ao criar quiz:', error);
        return res.status(500).render('pages/createQuiz', {
            themes: await global.db.getThemes(),
            mainClass: 'main-content creator-layout',
            pageCSS: ['/stylesheets/create.css'],
            error: 'Erro ao criar quiz. Tente novamente.',
            formData: req.body
        });
    }
});

module.exports = router;