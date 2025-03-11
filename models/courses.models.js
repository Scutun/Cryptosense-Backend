const db = require('../config/db').pool
const redis = require('../config/db').redisClient

class CoursesModel {
    async createCourse(info, creatorId) {
        try {
            const result = await db.query(
                `INSERT INTO courses (title, description, creator_id, course_duration, difficulty_id, creation_date) 
                 VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id`,
                [info.title, info.description, creatorId, info.courseDuration, info.difficultyId],
            )

            return result.rows[0].id
        } catch (error) {
            throw error
        }
    }

    async addCourseTags(courseId, tagsArray) {
        try {
            await db.query('DELETE FROM course_tags WHERE course_id = $1', [courseId])

            const values = tagsArray.flat()
            const placeholders = tagsArray
                .map((row, i) => `(${row.map((_, j) => `$${i * row.length + j + 1}`).join(', ')})`)
                .join(', ')

            await db.query(
                `INSERT INTO course_tags (course_id, tag_id) VALUES ${placeholders}`,
                values,
            )
        } catch (error) {
            throw error
        }
    }

    async updateCourse(info, creatorId) {
        try {
            const course = await db.query(
                `SELECT * FROM courses where creator_id = $1 and id = $2`,
                [creatorId, info.courseId],
            )
            if (course.rowCount < 1) {
                throw { status: 403, message: 'У вас недостаточно прав для удаления этого курса' }
            }
            const result = await db.query(
                `UPDATE courses 
                 SET title = $1, 
                     description = $2, 
                     course_duration = $3, 
                     difficulty_id = $4,
                     course_photo = $5  
                 WHERE id = $6 and creator_id = $7`,
                [
                    info.title,
                    info.description,
                    info.courseDuration,
                    info.difficultyId,
                    info.coursePhoto,
                    info.courseId,
                    creatorId,
                ],
            )
        } catch (error) {
            throw error
        }
    }

    async deleteCourse(courseId, userId) {
        try {
            const course = await db.query(
                `SELECT * FROM courses where creator_id = $1 and id = $2`,
                [userId, courseId],
            )
            if (course.rowCount < 1) {
                throw { status: 403, message: 'У вас недостаточно прав для удаления этого курса' }
            }

            await redis.del(`course:${courseId}`)

            await db.query('DELETE FROM courses WHERE id = $1', [courseId])
        } catch (error) {
            throw error
        }
    }

    async getCourseInfoById(id) {
        try {
            const info = await db.query(
                `SELECT 
                    courses.id, courses.id, courses.title, courses.description, 
                    CONCAT(users.name, ' ', users.surname) AS creator, 
                    courses.creation_date, courses.course_duration, difficulties.name AS difficulty, 
                    ARRAY_AGG(tags.name) AS tags
                  FROM courses
                  LEFT JOIN users ON courses.creator_id = users.id
                  LEFT JOIN difficulties ON courses.difficulty_id = difficulties.id
                  LEFT JOIN course_tags ON courses.id = course_tags.course_id
                  LEFT JOIN tags ON course_tags.tag_id = tags.id
                  WHERE courses.id = $1
                  GROUP BY courses.id, users.name, users.surname, difficulties.name`,
                [id],
            )
            return info.rows[0]
        } catch (error) {
            throw error
        }
    }

    async getChosenCourses(id, limit, offset, status) {
        try {
            const countResult = await db.query(
                `SELECT COUNT(*) AS total 
                 FROM user_courses
                 WHERE user_id = $1 AND active = $2`,
                [id, status],
            )

            const total = parseInt(countResult.rows[0].total, 10)

            let query = `SELECT courses.id, CONCAT(users.name, ' ', users.surname) AS creator, 
                        courses.course_photo AS photo, 
                        courses.title,
                        courses.rating,
                        courses.reviews_count as reviews,
                        courses.subscribers, 
                        courses.course_duration as duration
                 FROM user_courses
                 LEFT JOIN courses ON user_courses.course_id = courses.id                
                 LEFT JOIN users ON courses.creator_id = users.id
                 WHERE user_courses.user_id = $1 AND user_courses.active = $2
                 GROUP BY courses.id, users.name, users.surname`

            const params = [id, status]

            if (limit !== 'ALL') {
                query += ` LIMIT $3 OFFSET $4`
                params.push(Number(limit) || 10, Number(offset) || 0)
            }

            const courses = await db.query(query, params)
            return { total, courses: courses.rows }
        } catch (error) {
            throw error
        }
    }

    async getAllCourses(limit, offset, search) {
        try {
            const searchQuery = search ? `%${search}%` : `%`

            const countResult = await db.query(
                `SELECT COUNT(DISTINCT courses.id) AS total 
                 FROM courses
                 LEFT JOIN course_tags ON courses.id = course_tags.course_id
                 LEFT JOIN tags ON course_tags.tag_id = tags.id
                 WHERE courses.title ILIKE $1 OR tags.name ILIKE $1`,
                [searchQuery],
            )

            const total = parseInt(countResult.rows[0].total, 10)

            let query = `SELECT courses.id, CONCAT(users.name, ' ', users.surname) AS creator, 
                courses.course_photo AS photo, 
                courses.title,
                courses.rating,
                courses.reviews_count as reviews,
                courses.subscribers, 
                courses.course_duration as duration
            FROM courses
            LEFT JOIN users ON courses.creator_id = users.id
            LEFT JOIN course_tags ON courses.id = course_tags.course_id
            LEFT JOIN tags ON course_tags.tag_id = tags.id
            WHERE courses.title ILIKE $1 OR tags.name ILIKE $1
            GROUP BY courses.id, users.name, users.surname`

            const params = [searchQuery]

            if (limit !== 'ALL') {
                query += ` LIMIT $2 OFFSET $3`
                params.push(Number(limit) || 10, Number(offset) || 0)
            }

            const info = await db.query(query, params)
            return { total, courses: info.rows }
        } catch (error) {
            throw error
        }
    }

    async getSortedCourses(limit, offset, sort, order, search) {
        try {
            const searchQuery = search ? `%${search}%` : `%`

            const countResult = await db.query(
                `SELECT COUNT(DISTINCT courses.id) AS total 
                 FROM courses
                 LEFT JOIN course_tags ON courses.id = course_tags.course_id
                 LEFT JOIN tags ON course_tags.tag_id = tags.id
                 WHERE courses.title ILIKE $1 OR tags.name ILIKE $1`,
                [searchQuery],
            )

            const total = parseInt(countResult.rows[0].total, 10)

            let query = `SELECT courses.id, CONCAT(users.name, ' ', users.surname) AS creator, 
                        courses.course_photo AS photo, 
                        courses.title,
                        courses.rating,
                        courses.reviews_count as reviews,
                        courses.subscribers, 
                        courses.course_duration as duration
                 FROM courses                
                 LEFT JOIN users ON courses.creator_id = users.id
                 LEFT JOIN course_tags ON courses.id = course_tags.course_id
                 LEFT JOIN tags ON course_tags.tag_id = tags.id
                 WHERE courses.title ILIKE $1 OR tags.name ILIKE $1
                 ORDER BY $2 ${order}`

            const params = [searchQuery, sort]

            if (limit !== 'ALL') {
                query += ` LIMIT $3 OFFSET $4`
                params.push(Number(limit) || 10, Number(offset) || 0)
            }

            const info = await db.query(query, params)

            return { total, courses: info.rows }
        } catch (error) {
            throw error
        }
    }

    async getCourseById(id) {
        try {
            const info = await db.query(`SELECT creator_id FROM courses WHERE id = $1`, [id])

            return info
        } catch (error) {
            throw error
        }
    }
}

module.exports = new CoursesModel()
