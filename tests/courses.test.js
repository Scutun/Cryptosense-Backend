const request = require('supertest');
const { describe, it, expect, beforeAll } = require('@jest/globals');
const { startServer } = require('../app');

let app;

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3NzUxOTgxLCJleHAiOjE3NDc3NTkxODF9.QdkLrA-Uai6_NmH8CjwRU088szW9l2EmbwsLUykfHsY';
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
            .attach('photo', 'tests/test.jpg'); // путь до изображения


        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
        id: expect.any(Number),
        title: 'Курс по JavaScript',
        description: 'Основы языка JS',
        creatorid: expect.any(String),                        // строка
        creationdate: expect.any(String),      // дата в строковом формате ISO
        duration: 16,
        difficultyid: 1,
        difficulty: 'Легкая',
        tags: ['Эфириум'],
        lessonscount: 0,
        testcount: 0,
        subscribers: 0,
        coursephoto: expect.any(String),       // строка с именем файла
        rating: '0.0',                         // строка (если это число — можно проверить через Number)
        unlockall: true
        });

    });

    // it('Ошибка: отсутствуют обязательные поля', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/courses/new')
    //         .set('Authorization', `Bearer ${validToken}`)
    //         .field('title', '') // пустое поле
    //         .field('courseDuration', 0); // невалидное значение

    //     expect(response.statusCode).toBe(400);
    //     expect(response.body.message).toBe('Не все поля заполнены');
    // });

    // it('Ошибка: невалидный токен', async () => {
    //     const response = await request(app)
    //         .post('/api/v1/courses/new')
    //         .set('Authorization', `Bearer ${invalidToken}`)
    //         .field('title', 'JS')
    //         .field('courseDuration', 10)
    //         .field('difficultyId', 1)
    //         .field('tags', [1])
    //         .attach('photo', 'cryptosense_backend/uploads/course/DefaultCoursePhoto.jpg');

    //     expect(response.statusCode).toBe(403);
    //     expect(response.body.message).toBe('Недействительный токен');
    // });

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
