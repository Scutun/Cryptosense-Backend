const bcrypt = require('bcrypt')
const model = require('../models/users.models')

class UsersService {
    async createUser(req) {
        try {
            const { email, password, login, name, surname } = req.body
            const hashPassword = await bcrypt.hash(password, 10)
            const date = new Date().toISOString().split('T')[0]
            const item = { email, hashPassword, login, name, surname, date }
            await model.createUser(item)
        } catch (error) {
            throw Error
        }
    }
}

module.exports = new UsersService()
