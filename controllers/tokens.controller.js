const jwt = require('jsonwebtoken')
const redisClient = require('../config/db').redisClient
const tokenService = require('../services/tokens.services')

class TokenController {
    async updateRefreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken

            if (!refreshToken) {
                return res.status(403).json({ message: 'The token is not provided' })
            }

            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await tokenService.compareRefreshToken(refreshToken, user.id)
            const newTokens = tokenService.genAllTokens(user.id)
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
