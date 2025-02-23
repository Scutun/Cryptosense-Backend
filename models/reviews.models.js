const db = require('../config/db').pool

class ReviewsModel {
    async getReviewByCourseId(id) {
        try {
            const review = await db.query(
                `SELECT id, rating, content, user_nickname as nickname FROM comments WHERE course_id = $1`,
                [id],
            )
            return review.rows
        } catch (error) {
            throw error
        }
    }
}

module.exports = new ReviewsModel()
