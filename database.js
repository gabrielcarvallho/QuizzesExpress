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
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (users.length === 0) {
            return { error: 'E-mail ou senha inválidos' };
        }
        
        return users[0];
    } catch (error) {
        console.error('Erro no login:', error);
        return { error: 'Erro ao fazer login' };
    }
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
        'SELECT name FROM Themes'
    )

    return themes
}

async function getQuizzes() {
    const [quizzes] = await global.connection.promise().query(
        'SELECT id, title FROM Quizzes'
    )

    return quizzes
}

module.exports = { 
    connectDb, 
    login, 
    register, 
    getThemes
};