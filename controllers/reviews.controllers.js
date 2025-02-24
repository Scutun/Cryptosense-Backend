const tokenUtils = require('../utils/tokens.utils')
const reviewsService = require('../services/reviews.services')

class ReviewsController {
    async createReview(req, res, next) {
        try {
            const user = tokenUtils.getIdFromToken(req)
            await reviewsService.createReview(user.id, req.body)

            res.status(201).json({ message: 'Отзыв создан' })
        } catch (error) {
            next(error)
        }
    }

    async changeReview(req, res, next) {
        try {
            const user = tokenUtils.getIdFromToken(req)
            await reviewsService.changeReview(user.id, req.body)
            res.status(201).json({ message: 'Отзыв изменен' })
        } catch (error) {
            next(error)
        }
    }

    async deleteReview(req, res, next) {
        try {
            const user = tokenUtils.getIdFromToken(req)
            await reviewsService.deleteReview(user.id, req.body.reviewId)
            res.status(200).json({ message: 'Отзыв удален' })
        } catch (error) {
            next(error)
        }
    }

    async getAllReviews(req, res, next) {
        try {
            const reviews = await reviewsService.getAllReviews(req.body.courseId)
            res.status(200).json(reviews)
        } catch (error) {
            next(error)
        }
    }

    async getReviewByCourseId(id) {
        try {
            if (id.length === 0) {
                throw { status: 400, message: 'Id курса не предоставлен' }
            }

            const info = await reviewsModel.getReviewByCourseId(id)

            if (!info[0]) {
                throw { status: 404, message: 'Курс не найден' }
            }
            return info
        } catch (error) {
            throw error
        }
    }

}

module.exports = new ReviewsController()
