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

            return user
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

            return user
        } catch (error) {
            throw error
        }
    }

    async activateUser(email) {
        try {
            const user = await db.query(
                `UPDATE users SET activated = true WHERE email = $1 RETURNING id`,
                [email],
            )
            return user.rows
        } catch (error) {
            throw error
        }
    }

    async updateUserPassword(id, hashPassword) {
        try {
            await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashPassword, id])
        } catch (error) {
            throw error
        }
    }

    async getUser(id) {
        try {
            const result = await db.query(
                `SELECT users.name, users.surname, users.email, users.nickname, users.registration_date as registrationDate, users.perutation, photos.name as photo FROM users 
                left join photos on users.photo_id = photos.id WHERE users.id = $1
                `,
                [id],
            )
            return result
        } catch (error) {
            throw error
        }
    }

    async updateUserInfo(id, info) {
        try {
            const { name, surname, nickname, photo } = info

            const photoId = await db.query(`SELECT id FROM photos WHERE name = $1`, [photo])

            if (photoId.rowCount === 0) {
                throw new Error()
            }

            const newUser = await db.query(
                `UPDATE users SET name = $1, surname = $2, nickname = $3, photo_id = $4 WHERE id = $5 RETURNING name, surname, nickname`,
                [name, surname, nickname, photoId.rows[0].id, id],
            )

            return {
                ...newUser.rows[0],
                photo,
            }
        } catch (error) {
            if (error.code === '23505') {
                throw {
                    status: 400,
                    message: `Пользователь с никнеймом: ${nickname} уже существует`,
                }
            }
            throw error
        }
    }

    async deleteUser(id) {
        try {
            await db.query(`DELETE FROM users WHERE id = $1`, [id])
        } catch (error) {
            throw error
        }
    }
}

module.exports = new UsersModel()
