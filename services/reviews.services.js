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

            await reviewsModel.createReview(reviewInfo)
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

module.exports = new ReviewsService()
