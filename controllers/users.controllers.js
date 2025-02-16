const userService = require('../services/users.services')
const tokenService = require('../services/tokens.services')
const emailService = require('../services/email.services')
class UsersController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body)
            const emailToken = tokenService.genAccessToken(user.id)
            await emailService.sendVerificationEmail(user.email, emailToken)
            res.status(201).json({ message: 'the letter has been sent to the post office' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    async loginUser(req, res) {
        try {
            const user = await userService.findUser(req.body)
            const newTokens= tokenService.genAllTokens(user.id)
            await tokenService.saveRefreshToken(user.id, refreshToken)

            res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: true })
            res.json({ accessToken: newTokens.accessToken })
        } catch (error) {
            res.status(401).json({ message: error.message })
        }
    }
}

module.exports = new UsersController()
