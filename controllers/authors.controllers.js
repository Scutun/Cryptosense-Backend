const authorsService = require('../services/authors.services')
const tokenUtils = require('../utils/tokens.utils')

class AuthorsController {
    async getAuthorById(req, res, next) {
        try {
            const author = await authorsService.getAuthorById(req.params.id)
            res.status(200).json(author)
        } catch (error) {
            next(error)
        }
    }

    async becomeAuthor(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const author = await authorsService.becomeAuthor(req.body.description, userId)
            res.status(200).json(author)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthorsController()
