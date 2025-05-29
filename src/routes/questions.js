const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');

router.get('/:quizId/create', requireAuth, async function(req, res, next) {
    try {
        const { quizId } = req.params;
        const quiz = await global.db.getQuizById(quizId);

        if (!quiz) {
            res.status(404).send('Quiz não encontrado.');
        }

        if (quiz.created_by_id != req.session.user.id) {
            res.status(403).send('Acesso negado.');
        }

        res.render('pages/createQuestions', {
            quiz: quiz,
            mainClass: 'main-content creator-layout',
            pageCSS: ['/stylesheets/questions.css'],
            pageJS: ['/js/quiz-questions.js']
        });
    } catch (error) {
        console.log('Erro interno do servidor: ', error);
        return res.status(500).send('Erro interno do servidor');
    }
});

router.post('/:quizId/create', requireAuth, async function(req, res, next) {
    const { questionText, answers } = req.body;
    const quizId = req.params.quizId;

    const questionId = await global.db.createQuestion(questionText);

    for (let answer of answers) {
        await global.db.createAnswer({
            questionId: questionId,
            answerText: answer.text,
            isCorrect: answer.isCorrect
        });
    }

    await global.db.addQuestionToQuiz({
        quizId: quizId,
        questionId: questionId
    });

    res.json({ success: true });
});

module.exports = router;