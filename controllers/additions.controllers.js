const additionsService = require('../services/additions.services')

class AdditionsController {
    async getTags(req, res, next) {
        try {
            const tags = await additionsService.getTags()
            res.status(200).json(tags)
        } catch (error) {
            next(error)
        }
    }

    async getDifficulties(req, res, next) {
        try {
            const difficulties = await additionsService.getDifficulties()
            res.status(200).json(difficulties)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AdditionsController()
