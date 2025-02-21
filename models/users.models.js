const db = require('../config/db').pool

class UsersModel {
    async newUser(info) {
        try {
            const { email, hashPassword, login, name, surname, date } = info
            console.log(info)
            const user = await db.query(
                `INSERT INTO  users (name,surname,email,password,nickname,registration_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
                [name, surname, email, hashPassword, login, date],
            )
            return user.rows[0].id
        } catch (error) {
            if (error.code === '23505') {
                throw {
                    status: 400,
                    message: `Пользователь с ${error.detail.key === 'email' ? 'с таким e-mail' : 'с таким логином'} уже существет`,
                }
            }

            throw { status: 400, message: `Ошибка создания пользователя: ${error.message}` }
        }
    }

    async searchUsers(email, login) {
        try {
            const user = await db.query(
                `SELECT id,activated,password FROM users WHERE email = $1 OR nickname = $2`,
                [email, login],
            )
            return user.rows
        } catch (error) {
            throw { status: 400, message: `Ошибка поиска пользователя: ${error.message}` }
        }
    }

    async loginUser(email) {
        try {
            const user = await db.query(
                `SELECT id,activated,password FROM users WHERE email = $1 `,
                [email],
            )

            return user.rows[0]
        } catch (error) {
            throw {
                status: 400,
                message: `Ошибка при поиске пользователя с таким электронным адресом: ${error.message}`,
            }
        }
    }

    async activateUser(email) {
        try {
            await db.query(`UPDATE users SET activated = true WHERE email = $1`, [email])
        } catch (error) {
            throw { status: 400, message: `Ошибка при активации пользователя: ${error.message}` }
        }
    }

    async updateUserPassword(email, hashPassword) {
        try {
            await db.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashPassword, email])
        } catch (error) {
            throw {
                status: 400,
                message: `Ошибка обновления пароля пользователя: ${error.message}`,
            }
        }
    }
}

module.exports = new UsersModel()
