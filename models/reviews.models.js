const db = require('../config/db').pool

class ReviewsModel {
    async createReview(info) {
        try {
            const review = await db.query(
                `INSERT INTO comments (rating, content, user_id, course_id, user_nickname) 
                 VALUES ($1, $2, $3, $4, (SELECT nickname FROM users WHERE id = $3)) RETURNING id`,
                [info.rating, info.content, info.userId, info.courseId],
            )

            await db.query(
                `UPDATE courses SET rating = (SELECT AVG(rating) FROM comments WHERE course_id = $1), reviews_count = (SELECT COUNT(*) FROM comments WHERE course_id = $1) WHERE id = $1`,
                [info.courseId],
            )

            return review.rows[0]
        } catch (error) {
            if (error.code === '23505') {
                throw {
                    status: 400,
                    message: 'Этот пользователь уже оставил отзыв для этого курса',
                }
            }
            throw error
        }
    }

    async getReviewByCourseId(courseId, offset, limit, sort, order) {
        try {
            let sql = `SELECT comments.id, comments.rating, comments.content, users.nickname, photo.name as photo FROM comments 
                LEFT JOIN users ON comments.user_id = users.id
                LEFT JOIN photos as photo ON users.photo_id = photo.id
                WHERE comments.course_id = $1`

            const values = [courseId]

            sql += ` ORDER BY ${sort} ${order}`

            if (offset && limit) {
                sql += ` OFFSET $2 LIMIT $3`
                values.push(Number(offset), Number(limit))
            }

            const review = await db.query(sql, values)

            return review.rows
        } catch (error) {
            throw error
        }
    }

    async deleteReview(userId, reviewId) {
        try {
            const result = await db.query(
                `DELETE FROM comments 
                 WHERE id = $1 AND user_id = $2 
                 RETURNING course_id`,
                [reviewId, userId],
            )

            const courseId = result.rows[0]?.course_id

            if (courseId) {
                await db.query(
                    `UPDATE courses 
                   SET rating = (SELECT AVG(rating) FROM comments WHERE course_id = $1),
                       reviews_count = (SELECT COUNT(*) FROM comments WHERE course_id = $1)
                   WHERE id = $1`,
                    [courseId],
                )
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
                 AND user_id = $4 
                 
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

    async getReviewByUserId(userId, courseId) {
        try {
            const review = await db.query(
                `SELECT comments.id, comments.rating, comments.content, users.nickname, photo.name as photo FROM comments 
                LEFT JOIN users ON comments.user_id = users.id
                LEFT JOIN photos as photo ON users.photo_id = photo.id
                WHERE comments.user_id = $1 AND comments.course_id = $2`,
                [userId, courseId],
            )
            return review.rows
        } catch (error) {
            throw error
        }
    }
}

module.exports = new ReviewsModel()
