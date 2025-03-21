const authorsModel = require('../models/authors.models')

class AuthorsService {
    async getAuthorById(id) {
        try {
            if (!id) {
                throw { status: 400, message: 'Не передан id автора' }
            }

            const author = await authorsModel.getAuthorById(id)
            if (!author.rows[0]) {
                throw { status: 404, message: 'Автор не найден' }
            }

            return author
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AuthorsService()
