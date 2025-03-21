const authorsService = require('../services/authors.services')

class AuthorsController {
    async getAuthorById(req, res, next) {
        try {
            const author = await authorsService.getAuthorById(req.query.id)
            res.status(200).json(author)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthorsController()
