const request = require('supertest')
const { describe, it, expect, beforeAll,afterAll } = require('@jest/globals')
const { startServer } = require('../app')


let app

beforeAll(async () => {
    app = await startServer()
})


const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ3MjM2OTcyLCJleHAiOjE3NDcyNDQxNzJ9.mwlsGKcfoIWiFZXo5L5jyq8BfWd1WPlyl30vRMCr0no'

describe('Тестирование API /v1/users/me', () => {
    it('Должен вернуть информацию о пользователе', async () => {
        const response = await request(app)
            .get('/api/v1/users/me')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                email: expect.any(String),
                name: expect.any(String),
                surname: expect.any(String),
                nickname: expect.any(String),
                registrationdate: expect.any(String),
                reputation: expect.any(String),
                photo: expect.any(String),
                achievements: expect.any(Array),
                description: expect.any(String),
                isauthor: expect.any(Boolean),
            }),
        )
    })

    it('Должен вернуть ошибку при неверном токене', async () => {
        const response = await request(app)
            .get('/api/v1/users/me')
            .set('Authorization', `Bearer kansldn`)
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(403)
    })
})

describe('Тестирование API /v1/users/new/info', () => {
    it('Должен вернуть токен при правильных данных', async () => {
        const response = await request(app)
            .put('/api/v1/users/new/info')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                name: 'Алексей',
                surname: 'Краснов',
                nickname: 'CryptoGuru',
                photo: 'adminAvatar.jpg',
            })

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('surname')
        expect(response.body).toHaveProperty('nickname')
        expect(response.body).toHaveProperty('photo')
        expect(response.body).toEqual(
            expect.objectContaining({
                name: expect.any(String),
                surname: expect.any(String),
                nickname: expect.any(String),
                photo: expect.any(String),
            }),
        )
    })

    it('Должен вернуть ошибку при неверных данных', async () => {
        const response = await request(app)
            .put('/api/v1/users/new/info')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                name: 'Алексей',
                surname: 'Краснов',
                nickname: '',
                photo: 'adminAvatar.jpg',
            })

        expect(response.statusCode).toBe(400)
    })
})
