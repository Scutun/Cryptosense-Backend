const db = require('../config/db').pool

class AuthorsModel {
    async getAuthorById(id) {
        try {
            const author = await db.query(
                `SELECT CONCAT(users.name, ' ', users.surname) AS author, photo.name as photo, users.description, ARRAY_AGG(achievements.name) AS achievements FROM users 
                LEFT JOIN photos as photo ON users.photo_id = photo.id
                LEFT JOIN user_achievements ON users.id = user_achievements.user_id
                LEFT JOIN achievements ON user_achievements.achievement_id = achievements.id
                WHERE users.id = $1 and users.author = true`,
                [id],
            )
            return author
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AuthorsModel()
