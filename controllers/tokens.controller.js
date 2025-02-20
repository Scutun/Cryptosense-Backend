const jwt = require('jsonwebtoken')
const tokenService = require('../utils/tokens.services')

class TokenController {
    async updateRefreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return res.status(403).json({ message: 'Токен не предоставлен' })
            }

            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

            await tokenService.compareRefreshToken(refreshToken, user.id)

            const newTokens = tokenService.genAllTokens(user.id)

            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: false })
            res.json({ accessToken: newTokens.accessToken })
        } catch (error) {
            next({ status: 403, message: `Ошибка при обновлении токена доступа: ${error.message}` })
        }
    }
}

module.exports = new TokenController()
