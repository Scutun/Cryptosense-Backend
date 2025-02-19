const db = require('../config/db')

class UsersModel {
    async newUser(info) {
        try {
            const { email, hashPassword, login, name, surname, date } = info
            console.log(info)
            const user = await db.pool.query(
                `INSERT INTO  users (name,surname,email,password,nickname,registration_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,email`,
                [name, surname, email, hashPassword, login, date],
            )
            return user.rows[0].id
        } catch (error) {
            if (error.code === '23505') {
                if (error.detail.includes('email')) {
                    throw {
                        status: 400,
                        message: `The user with this email address: ${email} already exists`,
                    }
                } else if (error.detail.includes('nickname')) {
                    throw { status: 400, message: `The username "${login}" is already taken` }
                }
            }
            console.log(error)
            throw { status: 400, message: `Error when creating a user: ${error.message}` }
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
            throw { status: 400, message: `Error when getting user by email: ${error.message}` }
        }
    }
    async activateUser(user_id) {
        try {
            await db.query(`UPDATE users SET activated = true WHERE id = $1`, [user_id])
        } catch (error) {
            throw { status: 400, message: `Error when verifying user: ${error.message}` }
        }
    }
    async updateUserPassword(email, hashPassword) {
        try {
            await db.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashPassword, email])
        } catch (error) {
            throw { status: 400, message: `Error when updating user password: ${error.message}` }
        }
    }
}

module.exports = new UsersModel()
