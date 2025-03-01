const db = require('../config/db').pool

class CoursesModel {
    async getCourseInfoById(id) {
        try {
            const info = await db.query(
                `SELECT 
                    id, courses.id, courses.title, courses.description, 
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

            const courses = await db.query(
                `SELECT id, CONCAT(users.name, ' ', users.surname) AS creator, 
                        courses.course_photo AS photo, 
                        courses.title,
                        courses.rating,
                        courses.subscribers, 
                        courses.course_duration as duration
                 FROM user_courses
                 LEFT JOIN courses ON user_courses.course_id = courses.id                
                 LEFT JOIN users ON courses.creator_id = users.id
                 WHERE user_courses.user_id = $1 AND user_courses.active = $2
                 LIMIT $3 OFFSET $4`,
                [id, status, limit, offset],
            )

            return { total, courses: courses.rows }
        } catch (error) {
            throw error
        }
    }

    async getAllCourses(limit, offset) {
        try {
            const countResult = await db.query(
                `SELECT COUNT(*) AS total 
                 FROM courses`,
            )

            const total = parseInt(countResult.rows[0].total, 10)

            const info = await db.query(
                `SELECT id, CONCAT(users.name, ' ', users.surname) AS creator, 
                        courses.course_photo AS photo, 
                        courses.title,
                        courses.rating,
                        courses.subscribers, 
                        courses.course_duration as duration
                 FROM courses                
                 LEFT JOIN users ON courses.creator_id = users.id
                 LIMIT $1 OFFSET $2`,
                [limit, offset],
            )
            return { total, courses: info.rows }
        } catch (error) {
            throw error
        }
    }

    async getSortedCourses(limit, offset, sort, order) {
        try {
            const countResult = await db.query(
                `SELECT COUNT(*) AS total 
                 FROM courses`,
            )

            const total = parseInt(countResult.rows[0].total, 10)

            const info = await db.query(
                `SELECT id, CONCAT(users.name, ' ', users.surname) AS creator, 
                        courses.course_photo AS photo, 
                        courses.title,
                        courses.rating,
                        courses.subscribers, 
                        courses.course_duration as duration
                 FROM courses                
                 LEFT JOIN users ON courses.creator_id = users.id
                 ORDER BY $1 $2
                 LIMIT $3 OFFSET $4`,
                [sort, order, limit, offset],
            )
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
