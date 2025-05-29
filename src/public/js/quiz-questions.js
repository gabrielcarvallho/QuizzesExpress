let answerCount = 0;
let questionCount = 0;

window.onload = function() {
    document.getElementById('add-answer-btn').onclick = addAnswer;
    document.getElementById('add-question-btn').onclick = addQuestion;
    document.getElementById('finish-quiz-btn').onclick = finishQuiz;
    
    addAnswer();
    addAnswer();
    updateQuestionCount();
};

function addAnswer() {
    answerCount++;
    const container = document.getElementById('answers-container');
    
    const div = document.createElement('div');
    div.className = 'answer-group';
    div.innerHTML = `
        <label>Resposta ${answerCount}</label>
        <div class="answer-input-group">
            <input type="text" class="form-control" placeholder="Digite a resposta..." required />
            <input type="radio" name="correct_answer" value="${answerCount}" ${answerCount === 1 ? 'checked' : ''} />
            <span class="correct-label">Correta</span>
            <button type="button" class="remove-answer" onclick="removeAnswer(this)">Remover</button>
        </div>
    `;
    
    container.appendChild(div);
}

function removeAnswer(button) {
    if (answerCount <= 2) {
        alert('Mínimo 2 respostas');
        return;
    }
    
    button.parentElement.parentElement.remove();
    answerCount--;
    updateAnswerNumbers();
}

function updateAnswerNumbers() {
    const groups = document.querySelectorAll('.answer-group');
    answerCount = groups.length;
    groups.forEach((group, index) => {
        const label = group.querySelector('label');
        const radio = group.querySelector('input[type="radio"]');
        label.textContent = `Resposta ${index + 1}`;
        radio.value = index + 1;
    });
}

function addQuestion() {
    const questionText = document.getElementById('question-text').value.trim();
    
    if (!questionText) {
        alert('Digite a pergunta');
        return;
    }
    
    const answerInputs = document.querySelectorAll('.answer-group input[type="text"]');
    const correctRadio = document.querySelector('input[name="correct_answer"]:checked');
    
    const answers = [];
    answerInputs.forEach((input, index) => {
        if (input.value.trim()) {
            answers.push({
                text: input.value.trim(),
                isCorrect: correctRadio && correctRadio.value == (index + 1)
            });
        }
    });
    
    if (answers.length < 2) {
        alert('Mínimo 2 respostas');
        return;
    }
    
    fetch(`/questions/${quizId}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            questionText: questionText,
            answers: answers
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addQuestionToList(questionText);
            clearForm();
        } else {
            alert('Erro ao salvar');
        }
    })
    .catch(() => alert('Erro de conexão'));
}

function addQuestionToList(text) {
    questionCount++;
    const list = document.getElementById('questions-list');
    
    const emptyMsg = list.querySelector('.empty-questions');
    if (emptyMsg) emptyMsg.remove();
    
    const div = document.createElement('div');
    div.className = 'question-item';
    div.innerHTML = `
        <div style="display: flex; align-items: center;">
            <div class="question-number">${questionCount}</div>
            <div class="question-text">${text}</div>
        </div>
    `;
    
    list.appendChild(div);
    updateQuestionCount();
}

function clearForm() {
    document.getElementById('question-text').value = '';
    document.getElementById('answers-container').innerHTML = '';
    answerCount = 0;
    addAnswer();
    addAnswer();
}

function updateQuestionCount() {
    document.getElementById('question-count').textContent = questionCount;
}

function finishQuiz() {
    if (questionCount === 0) {
        alert('Adicione pelo menos uma pergunta');
        return;
    }
    
    if (confirm('Finalizar quiz?')) {
        window.location.href = '/';
    }
}