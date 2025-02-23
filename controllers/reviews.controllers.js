const reviewsService = require('../services/reviews.services')

class ReviewsController {
    async getReviewByCourseId(req, res, next) {
        try {
            const info = await reviewsService.getReviewByCourseId(req.params.id)
            res.json(info)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ReviewsController()
