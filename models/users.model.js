const db = require('../db')

require('dotenv').config()


class UsersModel {
    async newUser(email, hasPassword, login, name, sername, date) {
        try {
            const query = `INSERT INTO  users (name,surname,email,password,nickname,registration_date) VALUES ($1,$2,$3,$4,$5,$6)`
            const values = [name, sername, email, hasPassword, login, date]
            const rows = await db.query(query, values)
            return rows.rows[0]
        } catch (error) {
            if (error.code === '23505') {
                throw new Error(`Пользователь с таким email: ${email} уже существует`)
            }
            throw new Error(`Ошибка при создании пользователя: ${error.message} `)
        }
    }
}

module.exports = new UsersModel()