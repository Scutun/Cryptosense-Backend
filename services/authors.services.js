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

            return author.rows[0]
        } catch (error) {
            throw error
        }
    }

    async becomeAuthor(description, userId) {
        try {
            if (!userId || !description) {
                throw { status: 400, message: 'Не все данные переданы' }
            }

            const checkAuthor = await authorsModel.getAuthorById(userId)
            if (checkAuthor.rows[0]) {
                throw { status: 409, message: 'Пользователь уже является автором' }
            }

            const author = await authorsModel.becomeAuthor(description, userId)
            return author.rows[0]
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AuthorsService()
