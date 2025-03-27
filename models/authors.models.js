const db = require('../config/db').pool

class AuthorsModel {
    async getAuthorById(id) {
        try {
            const author = await db.query(
                `SELECT CONCAT(users.name, ' ', users.surname) AS name, photo.name as photo, users.description, ARRAY_AGG(achievements.name) AS achievements FROM users 
                LEFT JOIN photos as photo ON users.photo_id = photo.id
                LEFT JOIN user_achievements ON users.id = user_achievements.user_id
                LEFT JOIN achievements ON user_achievements.achievement_id = achievements.id
                WHERE users.id = $1 and users.author = true
                GROUP BY users.name, users.surname, photo.name, users.description`,
                [id],
            )
            return author
        } catch (error) {
            throw error
        }
    }

    async becomeAuthor(description, userId) {
        try {
            await db.query(`UPDATE users SET description = $1, author = true WHERE id = $2`, [
                description,
                userId,
            ])

            await db.query(
                `INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)`,
                [userId, 1],
            )

            const author = await db.query(
                `SELECT users.name, users.surname, users.email, users.nickname, users.registration_date as registrationDate, users.reputation, photos.name as photo, users.description, ARRAY_AGG(achievements.name) AS achievements, users.author as isAuthor FROM users 
                left join photos on users.photo_id = photos.id
                left join user_achievements ON users.id = user_achievements.user_id 
                left join achievements ON user_achievements.achievement_id = achievements.id 
                WHERE users.id = $1
                GROUP BY users.name, users.surname, photos.name, users.description, users.email, users.nickname, users.registration_date, users.reputation, users.author`,
                [userId],
            )
            return author
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AuthorsModel()
