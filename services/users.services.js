const bcrypt = require('bcrypt')
const modelUser = require('../models/users.models')
class UsersService {
    async createUser(req) {
        try {
            const { email, password, login, name, surname } = req
            const hashPassword = await bcrypt.hash(password, 10)
            const date = new Date().toISOString().split('T')[0]
            const info = { email, hashPassword, login, name, surname, date }
            return await modelUser.newUser(info)
        } catch (error) {
            throw { status: 400, message: `Error when creating a user: ${error.message} ` }
        }
    }
    async loginUser(req) {
        try {
            const { email, password } = req

            const user = await modelUser.loginUser(email)

            if (user.length === 0) {
                throw { status: 404, message: 'User not found' }
            } else if (user.activated == false) {
                throw { status: 403, message: 'User is not activated' }
            }

            if (!bcrypt.compare(user.password, password)) {
                throw { status: 401, message: 'Invalid password' }
            }

            return user.id
        } catch (error) {
            throw Error
        }
    }
    async activateUser(user_id) {
        try {
            const user = await modelUser.activateUser(user_id)
            return user
        } catch (error) {
            throw { status: 400, message: `Error when activating user: ${error.message}` }
        }
    }
    async resetUserPassword(req) {
        const user = await modelUser.loginUser(req.email)
        if (user.length === 0) {
            throw { status: 404, message: 'User not found' }
        } else if (user.activated === false) {
            throw { status: 403, message: 'User is not activated' }
        }
        return user.id
    }
    async newUserPassword(req) {
        try {
            const { email, password } = req
            const hashPassword = await bcrypt.hash(password, 10)
            await modelUser.updateUserPassword(email, hashPassword)
        } catch (error) {
            throw { status: 400, message: `Error when resetting user password: ${error.message}` }
        }
    }
}

module.exports = new UsersService()
