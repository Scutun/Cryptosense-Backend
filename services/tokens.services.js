const jwt = require('jsonwebtoken')
const redis = require('../config/db')
class Tokens {
    genAccessToken(user_id) {
        const accessToken = jwt.sign({ id: user_id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '2h',
        })
        return accessToken
    }
    genAllTokens(user_id) {
        const accessToken = jwt.sign({ id: user_id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '2h',
        })
        const refreshToken = jwt.sign({ id: user_id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        })
        return { accessToken, refreshToken }
    }
    async saveRefreshToken(user_id, refreshToken) {
        // 7 дней (604800  секунд)
        try {
            await redis.setex(`user_id:${user_id}`, 604800 , refreshToken)
        } catch (error) {
            throw { status: 500, message: 'Ошибка при сохранении refresh-токена', error: error.message };
        }
    }
}
module.exports = new Tokens()
