const userService = require('../services/users.services')
const tokenUtils = require('../utils/tokens.utils')
const emailUtils = require('../utils/emails.utils')
const jwt = require('jsonwebtoken')

class UsersController {
    async createUser(req, res, next) {
        try {
            await userService.searchUsers(req.email, req.login)

            const emailToken = tokenUtils.genAccessToken(req.email)
            await emailUtils.sendVerificationEmail(req.body.email, emailToken)
            await userService.createUser(req.body)

            res.status(201).json({ message: 'Письмо отправлено на почту' })
        } catch (error) {
            next(error)
        }
    }

    async loginUser(req, res, next) {
        try {
            const id = await userService.loginUser(req.body)
            const newTokens = tokenUtils.genAllTokens(id)

            await tokenUtils.saveRefreshToken(id, newTokens.refreshToken)

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
            const emailToken = tokenUtils.genAccessToken(user)

            await emailUtils.sendResetPasswordEmail(req.body.email, emailToken)

            res.status(201).json({ message: 'Письмо отправлено на почту' })
        } catch (error) {
            next(error)
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const user = getIdFromToken(req)

            await userService.activateUser(user.id)
            const newTokens = tokenUtils.genAllTokens(user.id)

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
