const userService = require('../services/users.services')
const tokenService = require('../utils/tokens.utils')
const emailService = require('../utils/emails.utils')
const jwt = require('jsonwebtoken')

class UsersController {
    async createUser(req, res, next) {
        try {
            await userService.searchUsers(req.email, req.login)

            const emailToken = tokenService.genAccessToken(req.email)
            await emailService.sendVerificationEmail(req.body.email, emailToken)
            await userService.createUser(req.body)

            res.status(201).json({ message: 'Письмо отправлено на почту' })
        } catch (error) {
            next(error)
        }
    }

    async loginUser(req, res, next) {
        try {
            const id = await userService.loginUser(req.body)
            const newTokens = tokenService.genAllTokens(id)

            await tokenService.saveRefreshToken(id, newTokens.refreshToken)

            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: false })
            res.status(201).json({
                accessToken: newTokens.accessToken,
                message: 'Пользователь авторизован',
            })
        } catch (error) {
            next(error)
        }
    }

    async resetUserPassword(req, res, next) {
        try {
            const user = await userService.resetUserPassword(req.body)
            const emailToken = tokenService.genAccessToken(user)

            await emailService.sendResetPasswordEmail(req.body.email, emailToken)

            res.status(201).json({ message: 'Письмо отправлено на почту' })
        } catch (error) {
            next(error)
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const user = getIdFromToken(req)

            await userService.activateUser(user.id)
            const newTokens = tokenService.genAllTokens(user.id)

            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: false })
            res.status(201).json({
                accessToken: newTokens.accessToken,
                message: 'Пользователь зарегистрован',
            })
        } catch (error) {
            next(error)
        }
    }

    async newUserPassword(req, res, next) {
        try {
            await userService.newUserPassword(req.body)

            res.status(202).json({ message: 'Пароль успешно обновлен' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UsersController()
