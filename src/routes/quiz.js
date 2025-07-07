const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');

router.get('/create', requireAuth, async function(req, res, next) {
    try {
        const themes = await global.db.getThemes();

        res.render('pages/createQuiz', {
            themes: themes,
            mainClass: 'main-content creator-layout',
            pageCSS: ['/stylesheets/createQuiz.css'],
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
            pageCSS: ['/stylesheets/createQuiz.css'],
            error: 'Erro ao criar quiz. Tente novamente.',
            formData: req.body
        });
    }
});

router.post('/:quizId/submit', async function(req, res, next) {
    try {
        const { quizId } = req.params;
        const { answers, userId, timeTaken } = req.body;

        const correctAnswers = await global.db.getCorrectAnswers(quizId);

        let score = 0;
        const totalQuestions = correctAnswers.length;
        
        answers.forEach(userAnswer => {
            const correctAnswer = correctAnswers.find(ca => ca.question_id === userAnswer.questionId);
            if (correctAnswer && correctAnswer.correct_answer_id === userAnswer.answerId) {
                score++;
            }
        });

        const resultId = await global.db.saveQuizResult({
            userId,
            quizId,
            score,
            totalQuestions,
            timeTaken
        });

        res.json({
            success: true,
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            resultId
        });
        
    } catch (error) {
        console.error('Erro ao processar quiz:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:quizId', async function(req, res, next) {
    try {
        const { quizId } = req.params
        const quiz = await global.db.getQuizById(quizId);

        res.render('pages/quiz', {
            quiz: quiz,
            pageCSS: ['/stylesheets/quiz.css']
        });
    } catch (error) {
        console.error('Erro interno do servidor: ', error);
        return res.status(500).send('Erro interno do servidor');
    }
})

module.exports = router;