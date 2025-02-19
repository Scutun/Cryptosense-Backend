const jwt = require('jsonwebtoken')
const redisClient = require('../config/db')
const cookieParser = require('cookie-parser')

class TokenController {
    async updateRefreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return res.status(403).json({ message: 'The token is not provided' })
            }

            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await compareRefreshToken(refreshToken, user.userID)
            const newTokens = genAllTokens(user.userID)
            // Отправляем новый refresh-токен в куках
            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: true })

            // Возвращаем новый access-токен
            res.json({ accessToken: newTokens.accessToken })
        } catch (error) {
            return res
                .status(403)
                .json({ message: 'Error updating the token', error: error.message })
        }
    }
}

module.exports = new TokenController()
