const reviewsModel = require('../models/reviews.models')

class ReviewsService {
    async createReview(userId, info) {
        try {
            if (
                userId.length === 0 ||
                info.rating.length === 0 ||
                info.content.length === 0 ||
                info.courseId.length === 0
            ) {
                throw { status: 422, message: 'Переданы не все данные' }
            }

            const reviewInfo = {
                userId,
                rating: info.rating,
                content: info.content,
                courseId: info.courseId,
            }

            const result = await reviewsModel.createReview(reviewInfo)

            return result
        } catch (error) {
            throw error
        }
    }

    async changeReview(userId, info) {
        try {
            if (
                userId.length === 0 ||
                info.rating.length === 0 ||
                info.content.length === 0 ||
                info.reviewId.length === 0
            ) {
                throw { status: 422, message: 'Переданы не все данные' }
            }

            const reviewInfo = {
                userId,
                rating: info.rating,
                content: info.content,
                commentId: info.reviewId,
            }

            await reviewsModel.changeReview(reviewInfo)
        } catch (error) {
            throw error
        }
    }

    async deleteReview(userId, reviewId) {
        try {
            if (userId.length === 0 || reviewId.length === 0) {
                throw { status: 422, message: 'Идентификаторы не переданы' }
            }
            await reviewsModel.deleteReview(userId, reviewId)
        } catch (error) {
            throw error
        }
    }

    async getReviewByCourseId(req) {
        try {
            const { id, page, order = 'desc', limit } = req

            const sort = 'comments.rating'

            if (id.length === 0) {
                throw { status: 400, message: 'Id курса не предоставлен' }
            }

            const offset = (page - 1) * limit

            const info = await reviewsModel.getReviewByCourseId(id, offset, limit, sort, order)

            if (!info[0]) {
                throw { status: 404, message: 'Отзыв не найден' }
            }
            return {
                total: info.length,
                reviews: info,
            }
        } catch (error) {
            throw error
        }
    }

    async getReviewByUserId(userId, courseId) {
        try {
            if (userId.length === 0 || courseId.length === 0) {
                throw { status: 400, message: 'Идентификаторы не переданы' }
            }

            const info = await reviewsModel.getReviewByUserId(userId, courseId)

            if (!info[0]) {
                throw { status: 404, message: 'Отзыв не найден' }
            }

            return info[0]
        } catch (error) {
            throw error
        }
    }
}

module.exports = new ReviewsService()
