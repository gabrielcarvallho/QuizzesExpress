CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Themes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    theme_id INT NOT NULL,
    created_by_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (theme_id) REFERENCES Themes(id),
    FOREIGN KEY (created_by_id) REFERENCES Users(id)
);

CREATE TABLE Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL
);

CREATE TABLE Answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE
);

CREATE TABLE QuizzQuestions (
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    question_order INT NOT NULL,
    PRIMARY KEY (quiz_id, question_order),
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE
);

CREATE TABLE QuizResults (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(id)
);

INSERT INTO Themes (name) VALUES
('Ciência'),
('História'),
('Esportes'),
('Música'),
('Cinema'),
('Literatura'),
('Tecnologia'),
('Artes'),
('Matemática');