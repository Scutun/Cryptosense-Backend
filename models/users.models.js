const db = require('../config/db').pool

class UsersModel {
    async newUser(info) {
        try {
            const { email, hashPassword, login, name, surname, date } = info

            const user = await db.query(
                `INSERT INTO  users (name,surname,email,password,nickname,registration_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
                [name, surname, email, hashPassword, login, date],
            )
            return user.rows[0].id
        } catch (error) {
            throw error
        }
    }

    async searchUsers(email, login) {
        try {
            const user = await db.query(
                `SELECT email FROM users WHERE email = $1 OR nickname = $2`,
                [email, login],
            )
            return user.rows
        } catch (error) {
            throw error
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
            throw error
        }
    }

    async activateUser(email) {
        try {
            await db.query(`UPDATE users SET activated = true WHERE email = $1`, [email])
        } catch (error) {
            throw error
        }
    }

    async updateUserPassword(email, hashPassword) {
        try {
            await db.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashPassword, email])
        } catch (error) {
            throw error
        }
    }
}

module.exports = new UsersModel()
