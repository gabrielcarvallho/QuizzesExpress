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
                userId: 123,
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
});