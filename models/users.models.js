const db = require('../config/db')

class UsersModel {
    async newUser(info) {
        try {
            const { email, hashPassword, login, name, surname, date } = info
            const user = await db.query(
                `INSERT INTO  users (name,surname,email,password,nickname,registration_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,email`,
                [name, surname, email, hashPassword, login, date],
            )
            return user.rows[0]
        } catch (error) {
            if (error.code === '23505') {
                throw new Error(400, `The user with this email address: ${email} already exists`)
            }
            throw new Error(400, `Error when creating a user: ${error.message} `)
        }
    }

    async getUserByEmail(email,hashPassword) {
        try {
            const user = await db.query(`SELECT id,email,activated FROM users WHERE email = $1 and password = $2`, [
                email,hashPassword
            ])

            if (user.rows.length === 0) {
                throw new Error(404, 'User not found')
            } else if (user.rows[0].activated == false) {
                throw new Error(403, 'User is not activated')
            }

            return user.rows[0]
        } catch (error) {
            throw new Error(400, `Error when getting user by email: ${error.message}`)
        }
    }
    
}

module.exports = new UsersModel()
