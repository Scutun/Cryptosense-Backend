const request = require('supertest');
const { describe, it, expect, beforeAll } = require('@jest/globals');
const { startServer } = require('../app');

let app;

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzQ3ODE3ODc3LCJleHAiOjE3NDc4MjUwNzd9.j6K6qy-LfBJIs2cwqk3fJ3RrZU-c1AxBOgaVEimi0o0';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3NzUwNTgxLCJleHAiOjE3NDc3NTc3ODF9.Awre9YoVvPtLEwIiWtDgAI5dhYNEsdE5jzHhj9fsalf';
const notAuthorToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3NzUwNTgxLCJleHAiOjE3NDc3NTc3ODF9.Awre9YoVvPtLEwIiWtDgAI5dhYNEsdE5jzHhj9fsal0';

beforeAll(async () => {
    app = await startServer();
});

describe('POST /api/v1/courses/new', () => {
    it('Успешное создание курса', async () => {
        const response = await request(app)
            .post('/api/v1/courses/new')
            .set('Authorization', `Bearer ${validToken}`)
            .field('title', 'Курс по JavaScript')
            .field('description', 'Основы языка JS')
            .field('courseDuration', 16)
            .field('difficultyId', 1)
            .field('tags[]', 2)
            .attach('photo', 'tests/test.jpg'); 


        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
        id: expect.any(Number),
        title: 'Курс по JavaScript',
        description: 'Основы языка JS',
        creatorid: expect.any(String),                       
        creationdate: expect.any(String),      
        duration: 16,
        difficultyid: 1,
        tags: [2],
        lessonscount: 0,
        testcount: 0,
        subscribers: 0,
        rating: '0.0',                         
        unlockall: true,
        published:false,
        photo: expect.any(String)
        });

    });

    it('Ошибка: отсутствуют обязательные поля', async () => {
        const response = await request(app)
            .post('/api/v1/courses/new')
            .set('Authorization', `Bearer ${validToken}`)
            .field('title', 'Курс по JavaScript')
            .field('description', 'Основы языка JS')
            .field('courseDuration','' )
            .field('difficultyId', 10)
            .field('tags[]', 2)
            .attach('photo', 'tests/test.jpg'); 
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Не все поля заполнены');
    });

    it('Ошибка: невалидный токен', async () => {
        const response = await request(app)
            .post('/api/v1/courses/new')
            .set('Authorization', `Bearer ${invalidToken}`)
            .field('title', 'JS')
            .field('courseDuration', 10)
            .field('difficultyId', 1)
            .field('tags', [1])
            .attach('photo', 'cryptosense_backend/uploads/course/DefaultCoursePhoto.jpg');

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Недействительный токен');
    });

    // it('Ошибка: пользователь не автор', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/courses/new')
    //         .set('Authorization', `Bearer ${notAuthorToken}`)
    //         .field('title', 'JS')
    //         .field('courseDuration', 10)
    //         .field('difficultyId', 1)
    //         .field('tags', [1])
    //         .attach('photo', 'cryptosense_backend/uploads/course/DefaultCoursePhoto.jpg');

    //     expect(response.statusCode).toBe(409);
    //     expect(response.body.message).toBe('Этот пользователь не является автором и не может создавать курсы');
    // });
});
