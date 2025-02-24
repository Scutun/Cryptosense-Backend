const db = require('../config/db').pool

class CoursesModel {
    async getCourseInfoById(id) {
        try {
            const info = await db.query(
                `SELECT 
                    courses.id, courses.title, courses.description, 
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
}

module.exports = new CoursesModel()
