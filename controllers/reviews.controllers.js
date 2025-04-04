const tokenUtils = require('../utils/tokens.utils')
const reviewsService = require('../services/reviews.services')

class ReviewsController {
    async getReviewByCourseId(req, res, next) {
        try {
            const info = await reviewsService.getReviewByCourseId(req.query)
            res.json(info)
        } catch (error) {
            next(error)
        }
    }

    async createReview(req, res, next) {
        try {
            const user = tokenUtils.getIdFromToken(req)

            const info = await reviewsService.createReview(user, req.body)

            res.status(201).json(info)
        } catch (error) {
            next(error)
        }
    }

    async changeReview(req, res, next) {
        try {
            const user = tokenUtils.getIdFromToken(req)
            await reviewsService.changeReview(user, req.body)
            res.status(201).json({ message: 'Отзыв изменен' })
        } catch (error) {
            next(error)
        }
    }

    async deleteReview(req, res, next) {
        try {
            const user = tokenUtils.getIdFromToken(req)
            await reviewsService.deleteReview(user, req.params.id)
            res.status(200).json({ message: 'Отзыв удален' })
        } catch (error) {
            next(error)
        }
    }

    async getReviewByUserId(req, res, next) {
        try {
            const user = tokenUtils.getIdFromToken(req)

            const info = await reviewsService.getReviewByUserId(user, req.params.id)
            res.json(info)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ReviewsController()
