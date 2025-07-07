const mysql = require('mysql2');

async function connectDb() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    global.connection = connection;
    return connection;
}

async function login(email, password) {
    try {
        const [users] = await global.connection.promise().query(
            'SELECT * FROM Users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (users.length === 0) {
            return { error: 'E-mail ou senha inválidos' };
        }
        
        return users[0];
    } catch (error) {
        console.error('Erro no login:', error);
        return { error: 'Erro ao fazer login' };
    };
}

async function register(body) {
    const { username, email, password, confirmPassword } = body;
    
    const [exists_user] = await global.connection.promise().query(
        'SELECT username, email FROM Users WHERE username = ? OR email = ? LIMIT 1',
        [username, email]
    );

    if (exists_user.length > 0) {
        const conflicted_field = exists_user[0].username === username ? 'username' : 'email';
        return { error: `${conflicted_field} já está em uso` };
    }

    if (password !== confirmPassword) {
        return { error: 'As senhas não coincidem' };
    }

    await global.connection.promise().query(
        'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );

    return { success: 'Usuário registrado com sucesso' };
}

async function getThemes() {
    const [themes] = await global.connection.promise().query(
        'SELECT id, name FROM Themes'
    );

    return themes;
}

async function getQuizzes() {
    const [quizzes] = await global.connection.promise().query(`
        SELECT 
            q.id, 
            q.title,
            q.theme_id,
            t.name
        FROM Quizzes AS q
        INNER JOIN Themes AS t ON t.id = q.theme_id
        INNER JOIN Users AS u ON u.id = q.created_by_id
        ORDER BY q.created_at
    `);

    return quizzes;
}

async function getQuizById(quizId) {
    const [rows] = await global.connection.promise().query(`
        SELECT 
            q.id, 
            q.title,
            t.name AS theme_name,
            q.created_by_id,
            u.username,
            q.created_at
        FROM Quizzes q
        JOIN Themes t ON q.theme_id = t.id
        JOIN Users u ON q.created_by_id = u.id
        WHERE q.id = ?
    `, [quizId]);

    return rows[0];
}

async function createQuiz(data) {
    const [result] = await global.connection.promise().query(
        'INSERT INTO Quizzes (title, theme_id, created_by_id) VALUES (?, ?, ?)',
        [data.title, data.theme_id, data.created_by_id]
    );

    return result.insertId;
}

async function createQuestion(questionText) {
    const [result] = await global.connection.promise().query(
        'INSERT INTO Questions (question_text) VALUES (?)',
        [questionText]
    )

    return result.insertId
}

async function createAnswer(data) {
    await global.connection.promise().query(
        'INSERT INTO Answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)',
        [data.questionId, data.answerText, data.isCorrect]
    )
}

async function addQuestionToQuiz(data) {
    const orderQuery = 'SELECT COALESCE(MAX(question_order), 0) + 1 as next_order FROM QuizzQuestions WHERE quiz_id = ?';
    const [orderResult] = await global.connection.promise().query(orderQuery, [data.quizId]);
    const nextOrder = orderResult[0].next_order;

    const query = 'INSERT INTO QuizzQuestions (quiz_id, question_id, question_order) VALUES (?, ?, ?)';
    await global.connection.promise().query(query, [data.quizId, data.questionId, nextOrder]);
}

async function getCorrectAnswers(quizId) {
    const query = `
        SELECT 
            qq.question_id,
            a.id as correct_answer_id
        FROM QuizzQuestions qq
        JOIN Questions q ON qq.question_id = q.id
        JOIN Answers a ON q.id = a.question_id
        WHERE qq.quiz_id = ? AND a.is_correct = true
        ORDER BY qq.question_order
    `;
    
    return await db.query(query, [quizId]);
}

async function saveQuizResult(resultData) {
    const query = `
        INSERT INTO QuizResults (user_id, quiz_id, score, total_questions, time_taken)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(query, [
        resultData.userId,
        resultData.quizId,
        resultData.score,
        resultData.totalQuestions,
        resultData.timeTaken
    ]);
    
    return result.insertId;
}

async function getUserQuizHistory(userId) {
    const query = `
        SELECT 
            qr.*,
            q.title as quiz_title,
            t.name as theme_name
        FROM QuizResults qr
        JOIN Quizzes q ON qr.quiz_id = q.id
        JOIN Themes t ON q.theme_id = t.id
        WHERE qr.user_id = ?
        ORDER BY qr.completed_at DESC
    `;
    
    return await db.query(query, [userId]);
}

module.exports = { 
    connectDb, 
    login, 
    register, 
    getThemes,
    getQuizById,
    getQuizzes,
    createQuiz,
    createQuestion,
    createAnswer,
    addQuestionToQuiz,
    getCorrectAnswers,
    saveQuizResult,
    getUserQuizHistory
};