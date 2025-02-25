const db = require('../config/db').pool

class ReviewsModel {
    async createReview(info) {
        try {
            await db.query(
                `INSERT INTO comments (rating, content, user_nickname, course_id) 
                 VALUES ($1, $2, (SELECT nickname FROM users WHERE id = $3), $4)`,
                [info.rating, info.content, info.userId, info.courseId],
            )
        } catch (error) {
            throw error
        }
    }

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

    async deleteReview(userId, reviewId) {
        try {
            const result = await db.query(
                `DELETE FROM comments 
                 WHERE id = $1 AND user_nickname = (SELECT nickname FROM users WHERE id = $2)`,
                [reviewId, userId],
            )

            if (result.rowCount == 0) {
                throw { status: 404, message: 'Комментарий не найден' }
            }
        } catch (error) {
            throw error
        }
    }

    async changeReview(info) {
        try {
            const result = await db.query(
                `UPDATE comments 
                 SET rating = $1, content = $2 
                 WHERE id = $3 
                 AND user_nickname = (SELECT nickname FROM users WHERE id = $4) 
                 
                 RETURNING *`,
                [info.rating, info.content, info.commentId, info.userId],
            )

            if (result.rowCount === 0) {
                throw { status: 404, message: 'Комментарий не найден' }
            }

            return result.rows[0]
        } catch (error) {
            throw error
        }
    }
}

module.exports = new ReviewsModel()
