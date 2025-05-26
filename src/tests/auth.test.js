const request = require('supertest');
var app = require('../app');

describe('Authentication Routes', () => {
    describe('GET /auth/register', () => {
        it('Should return status 200', async () => {
            const response = await request(app).get('/auth/register');

            expect(response.text).toContain('register');
            expect(response.status).toBe(200);
        });
    });

    describe('POST /auth/register', () => {
        beforeEach(() => {
            global.db = {
                register: jest.fn()
            };
        });

        const userData = {
            'username': 'userTest',
            'email': 'usertest.dev@gmail.com',
            'password': '@Test_2025'
        };

        it('User created successfully', async () => {
            global.db.register.mockResolvedValue({
                success: true, 
                userId: 1,
                username: 'userTest' 
            });
 
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(global.db.register).toHaveBeenCalledWith(userData);
            expect(response.status).toBe(302);
        });

        it('E-mail already registered', async () => {
            global.db.register.mockResolvedValue({
                error: true, 
                message: 'Email already exists',
                code: 'DUPLICATE_EMAIL'
            });

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(global.db.register).toHaveBeenCalledWith(userData);
            expect(response.status).toBe(400);
        });

        it('Username already registered', async () => {
            global.db.register.mockResolvedValue({
                error: true, 
                message: 'Username already exists',
                code: 'DUPLICATE_USERNAME'
            });

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(global.db.register).toHaveBeenCalledWith(userData);
            expect(response.status).toBe(400);
        });

        it('Required fields', async () => {
            global.db.register.mockResolvedValue({
                error: true,
                message: 'Required fields',
                code: 'REQUIRED_FIELDS'
            })

            const userData = {
                'username': '',
                'email': '',
                'password': ''
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(global.db.register).toHaveBeenCalledWith(userData);
            expect(response.status).toBe(400);
        });
    });

    describe('GET /auth/login', () => {
        it('Should return status 200', async () => {
            const response = await request(app).get('/auth/register');

            expect(response.text).toContain('login');
            expect(response.status).toBe(200);
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(() => {
            global.db = {
                login: jest.fn()
            };
        });

        const userData = {
            'email': 'usertest.dev@gmail.com',
            'password': '@Test_2025'
        };

        it('Login successful', async () => {
            global.db.login.mockResolvedValue({ 
                success: true, 
                userId: 1,
                username: 'userTest'
            });

            const response = await request(app)
                .post('/auth/login')
                .send(userData);
            
            expect(global.db.login).toHaveBeenCalledWith(userData.email, userData.password);
            expect(response.status).toBe(302);
        });
        
        it('Invalid credentials', async () => {
            global.db.login.mockResolvedValue({
                error: true,
                message: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });

            const userData = {
                'email': 'usertest@gmail.com',
                'password': 'Test_2025'
            };

            const response = await request(app)
                .post('/auth/login')
                .send(userData);

            expect(global.db.login).toHaveBeenCalledWith(userData.email, userData.password);
            expect(response.status).toBe(400);
        });
    });
});