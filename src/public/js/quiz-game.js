class QuizGame {
    constructor(quizData, userId) {
        this.quiz = quizData;
        this.userId = userId;
        this.currentQuestion = 0;
        this.answers = [];
        this.startTime = Date.now();
        this.init();
    }
    
    init() {
        this.showQuestion();
        this.updateProgress();
    }
    
    showQuestion() {
        const question = this.quiz.questions[this.currentQuestion];
        
        document.getElementById('question-text').textContent = question.question_text;
        document.getElementById('question-number').textContent = 
            `Pergunta ${this.currentQuestion + 1} de ${this.quiz.questions.length}`;
        
        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = '';
        
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer.answer_text;
            button.onclick = () => this.selectAnswer(answer.id);
            answersContainer.appendChild(button);
        });
    }
    
    selectAnswer(answerId) {
        this.answers.push({
            questionId: this.quiz.questions[this.currentQuestion].id,
            answerId: answerId
        });
        
        if (this.currentQuestion < this.quiz.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion();
            this.updateProgress();
        } else {
            this.finishQuiz();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.quiz.questions.length) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
    }
    
    async finishQuiz() {
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        
        try {
            const response = await fetch(`/quiz/${this.quiz.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: this.answers,
                    userId: this.userId,
                    timeTaken: timeTaken
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showResults(result);
            } else {
                alert('Erro ao salvar resultado');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao processar quiz');
        }
    }
    
    showResults(result) {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'block';
        
        document.getElementById('final-score').textContent = 
            `${result.score}/${result.totalQuestions}`;
        document.getElementById('percentage').textContent = 
            `${result.percentage}%`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const quizData = {{{ json quiz }}};
    const userId = {{{ userId }}};
    
    new QuizGame(quizData, userId);
});