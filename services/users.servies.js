const bcrypt = require('bcrypt')
const model = require('../models/users.model')

class UsersService {
    async hashPassword(password) {
        return await bcrypt.hash(password, 10)
    }

    dateNow() {
        const date = new Date()
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }
    async createUser(req) {
        const { email, password, login, name, sername } = req.body
        const hashPassword = await service.hashPassword(password)
        const date = service.dateNow()
        const user = await model.createUser(email, hashPassword, login, name, sername, date)
    }
}

module.exports = new UsersService()
