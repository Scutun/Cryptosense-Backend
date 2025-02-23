const reviewsModel = require('../models/reviews.models')

class ReviewsService {
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
