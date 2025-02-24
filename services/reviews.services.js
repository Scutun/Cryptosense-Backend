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
            throw { status: 400, message: `Ошибка при создании отзыва: ${error.message}` }
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
            throw { status: 400, message: `Ошибка при редактирование отзыва: ${error.message}` }
        }
    }

    async deleteReview(userId, reviewId) {
        try {
            if (userId.length === 0 || reviewId.length === 0) {
                throw { status: 422, message: 'Идентификаторы не переданы' }
            }
            await reviewsModel.deleteReview(userId, reviewId)
        } catch (error) {
            throw { status: 400, message: `Ошибка при удалении отзыва: ${error.message}` }
        }
    }

    async getAllReviews(courseId) {
        try {
            if (courseId.length === 0) {
                throw { status: 422, message: 'Идентификатор курса не передан' }
            }
            const reviews = await reviewsModel.getAllReviews(courseId)
            return reviews
        } catch (error) {
            throw { status: 400, message: `Ошибка при получении всех отзывов: ${error.message}` }
        }
    }
}

module.exports = new ReviewsService()
