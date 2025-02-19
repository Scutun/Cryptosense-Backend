const userService = require('../services/users.services')
const tokenService = require('../services/tokens.services')
const emailService = require('../services/email.services')
const jwt = require('jsonwebtoken')
class UsersController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body)
            const emailToken = tokenService.genAccessToken(user)
            await emailService.sendVerificationEmail(req.body.email, emailToken)

            res.status(201).json({ message: 'the letter has been sent to the post office' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    async loginUser(req, res) {
        try {
            const user_id = await userService.loginUser(req.body)
            const newTokens = tokenService.genAllTokens(user_id)
            await tokenService.saveRefreshToken(user_id, newTokens.refreshToken)
            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: true })
            res.json({ accessToken: newTokens.accessToken })
        } catch (error) {
            res.status(401).json({ message: error.message })
        }
    }
    async resetUserPassword(req, res) {
        try {
            const user = await userService.resetUserPassword(req.body)
            const emailToken = tokenService.genAccessToken(user)
            await emailService.sendResetPasswordEmail(req.body.email, emailToken)
            res.status(200).json({ message: 'the letter has been sent to the post office' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    async verifyEmail(req, res) {
        try {
            const authHeaders = req.headers.authorization
            const token = authHeaders && authHeaders.split(' ')[1]
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            await userService.activateUser(user.id)
            const newTokens = tokenService.genAllTokens(user.id)
            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: true })
            res.json({ accessToken: newTokens.accessToken })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
    async newUserPassword(req, res) {
        try {
            await userService.newUserPassword(req.body)
            res.status(200).json({ message: 'password update sucsecc' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new UsersController()
