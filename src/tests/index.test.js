const request = require('supertest');
var app = require('../app');

describe('Quizz Routes', () => {
    beforeEach(() => {
        global.db = {
            getThemes: jest.fn().mockResolvedValue([
                { id: 1, name: 'História' }
            ]),
            getQuizzes: jest.fn().mockResolvedValue([
                { id: 1, title: 'História do Brasil', theme_id: 1, name: 'História' }
            ])
        };
    });

    describe('GET /', () => {
        it('Header component', async () => {
            const response = await request(app).get('/');

            expect(response.text).toContain('header');
            expect(response.status).toBe(200);
        });
        
        it('Should list themes correctly', async () => {
            const response = await request(app).get('/');

            if (response.text.includes('theme-link')) {
                expect(response.text).toContain('btn btn-primary');
                expect(response.text).toMatch(/\?theme=\d+/);
            }
            
            expect(response.status).toBe(200);
        });

        it('Should list quizzes correctly', async () => {
            const response = await request(app).get('/');

            if (response.text.includes('quizz-link')) {
                expect(response.text).toContain('btn play-btn');
                expect(response.text).toMatch(/\?quizz=\d+/);
            }

            expect(response.status).toBe(200);
        });
    });
});