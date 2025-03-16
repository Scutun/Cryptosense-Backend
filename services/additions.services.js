const additionsModel = require('../models/additions.models')

class AdditionsService {
    async getTags() {
        try {
            const tags = await additionsModel.getTags()
            if (tags.rowCount === 0) {
                throw { status: 404, message: 'Теги не найдены' }
            }

            return tags.rows
        } catch (error) {
            throw error
        }
    }

    async getDifficulties() {
        try {
            const difficulties = await additionsModel.getDifficulties()
            if (difficulties.rowCount === 0) {
                throw { status: 404, message: 'Сложности не найдены' }
            }

            return difficulties.rows
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AdditionsService()
