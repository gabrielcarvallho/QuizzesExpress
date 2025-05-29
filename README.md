# 🧠 Quizzes Express - Server Side

Projeto desenvolvido para a matéria de Server Side do terceiro semestre do curso de Engenharia de Software - PUCSC

## 📌 Descrição do projeto

O projeto consiste em uma plataforma de quizzes on-line que permite aos usuários criarem seus próprios desafios e interagirem com quizzes desenvolvidos por outros participantes. Os usuários podem acumular pontuações, acompanhar seu desempenho em um ranking geral e avaliar quizzes criados por outros participantes.

A aplicação foi desenvolvida utilizando Node.js e Express, com um ambiente dockerizado que inclui suporte ao banco de dados MySQL. O uso do Docker garante um ambiente de desenvolvimento padronizado entre os integrantes da equipe, facilitando a configuração, o controle de dependências e a execução da aplicação em diferentes máquinas.

## 👨‍💻 Integrantes da equipe

- Gabriel Carvalho
- Renato Colin Neto
- Enzo Gonçalves Werner

## 🚀 Como executar o ambiente

Para subir a infraestrutura do banco de dados via Docker, execute:

```bash
docker-compose up --build -d
```

Isso iniciará o container necessário para o funcionamento do banco de dados, incluindo a execução do script de criação localizado na pasta `/db/database.sql`.

## 💻 Como executar o projeto

Instale as dependências do projeto:

```bash
npm install
```

Execute o projeto:

```bash
npm start
```

Abra http://localhost:3000 no seu navegador para ver o resultado.