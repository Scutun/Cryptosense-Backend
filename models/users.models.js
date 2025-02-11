const db = require('../db')

class UsersModel {
    async newUser(info) {
        try {
            const { email, hashPassword, login, name, surname, date } = info
            const user = await db.query(
                `INSERT INTO  users (name,surname,email,password,nickname,registration_date) VALUES ($1,$2,$3,$4,$5,$6)`,
                [name, surname, email, hashPassword, login, date],
            )
        } catch (error) {
            if (error.code === '23505') {
                throw new Error(`Пользователь с таким email: ${email} уже существует`)
            }
            throw new Error(`Ошибка при создании пользователя: ${error.message} `)
        }
    }
}

module.exports = new UsersModel()
