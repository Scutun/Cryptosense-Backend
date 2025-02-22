const jwt = require('jsonwebtoken')
const tokenService = require('../utils/tokens.utils')

class TokenController {
    async updateRefreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken
            if (refreshToken.length === 0) {
                return res.status(422).json({ message: 'Токен не предоставлен' })
            }

            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            await tokenService.compareRefreshToken(refreshToken, user.id)

            const newTokens = tokenService.genAllTokens(user.id)

            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: false })
            res.status(201).json({ accessToken: newTokens.accessToken, message: 'Токен обновлен' })
        } catch (error) {
            next({ status: 400, message: `Ошибка при обновлении токена доступа: ${error.message}` })
        }
    }
}

module.exports = new TokenController()
