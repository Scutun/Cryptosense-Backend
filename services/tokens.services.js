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
            expiresIn: '14d',
        })
        return { accessToken, refreshToken }
    }
    async saveRefreshToken(user_id, refreshToken) {
        // 14 дней (1209600  секунд)
        try {
            await redis.setex(`user_id:${user_id}`, 1209600, refreshToken)
        } catch (error) {
            throw { status: 500, message: `Error saving the refresh token: ${error.message}` }
        }
    }
    async compareRefreshToken(refreshToken, user_id) {
        try {
            const storedRefreshToken = await redis.get(`user_id:${user_id}`)

            if (storedRefreshToken && storedRefreshToken === refreshToken) {
                return
            } else {
                throw { status: 401, message: 'Invalid refresh token' }
            }
        } catch (error) {
            throw { status: 500, message: `Error receiving refresh token ${error.message}` }
        }
    }
}
module.exports = new Tokens()
