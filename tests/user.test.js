const request = require('supertest')
const { describe, it, expect } = require('@jest/globals')
const app = require('../app')

describe('Тестирование API /v1/users/me', () => {
    it('Должен вернуть информацию о пользователе', async () => {
        const response = await request(app)
            .get('/api/v1/users/me')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQzNjY1NjU5LCJleHAiOjE3NDM2NzI4NTl9.eI9D5PJZJJZs4be2UG05nXXTVA5SGGq85lrvYyHDd_8',
            )
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('surname')
        expect(response.body).toHaveProperty('nickname')
        expect(response.body).toHaveProperty('registrationdate')
        expect(response.body).toHaveProperty('reputation')
        expect(response.body).toHaveProperty('photo')
        expect(response.body).toHaveProperty('achievements')
        expect(response.body).toHaveProperty('description')
        expect(response.body).toHaveProperty('isauthor')
    })

    it('Должен вернуть ошибку при неверном токене', async () => {
        const response = await request(app)
            .get('/api/v1/users/me')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQzNjY1NjU5LCJleHAiOjE3NDM2NzI4NTl9q85lrvYyHDd_8',
            )
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(403)
    })
})

describe('Тестирование API /v1/users/new/info', () => {
    it('Должен вернуть токен при правильных данных', async () => {
        const response = await request(app)
            .put('/api/v1/users/new/info')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQzNjY1NjU5LCJleHAiOjE3NDM2NzI4NTl9.eI9D5PJZJJZs4be2UG05nXXTVA5SGGq85lrvYyHDd_8',
            )
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
    })

    it('Должен вернуть ошибку при неверных данных', async () => {
        const response = await request(app)
            .put('/api/v1/users/new/info')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQzNjY1NjU5LCJleHAiOjE3NDM2NzI4NTl9.eI9D5PJZJJZs4be2UG05nXXTVA5SGGq85lrvYyHDd_8',
            )
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
