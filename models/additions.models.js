const db = require('../config/db').pool

class AdditionsModel {
    async getTags() {
        try {
            const tags = await db.query('SELECT * FROM tags ORDER BY id')
            return tags
        } catch (error) {
            throw error
        }
    }

    async getDifficulties() {
        try {
            const difficulties = await db.query('SELECT * FROM difficulties ORDER BY id')
            return difficulties
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AdditionsModel()
