const db = require('../config/db').pool

class SectionsModel {
    async createSection(info) {
        try {
            const section = await db.query(
                `INSERT INTO sections (name, course_id) VALUES ($1, $2) RETURNING id, name, course_id as courseId`,
                [info.name, info.courseId],
            )

            return section.rows[0]
        } catch (error) {
            if (error.code === '23503') {
                throw { status: 409, message: 'Раздел с таким названием уже существует' }
            }
            throw error
        }
    }

    async getSections(id) {
        try {
            const sections = await db.query(
                `SELECT id, name, course_id as courseId FROM sections where course_id = $1`,
                [id],
            )

            return sections
        } catch (error) {
            throw error
        }
    }

    async getSectionById(id) {
        try {
            const section = await db.query(
                `SELECT id, name, course_id as courseId FROM sections WHERE id = $1 ORDER BY id ASC`,
                [id],
            )

            return section
        } catch (error) {
            throw error
        }
    }

    async getSectionByIdWithAuthorization(userId, courseId) {
        try {
            const section = await db.query(
                `SELECT 
                    s.id, 
                    s.name,
                    s.course_id AS courseId,
                    COALESCE(us.is_completed, FALSE) AS isCompleted, 
                    COUNT(l.id) AS lessonCount,
                    COUNT(ul.lesson_id) FILTER (WHERE ul.user_id = $2) AS lessonCountFin,
                    CASE 
                        WHEN us.section_id IS NOT NULL THEN TRUE 
                        ELSE FALSE 
                    END AS isUnlocked
                FROM sections s
                LEFT JOIN user_sections us ON s.id = us.section_id
                LEFT JOIN lessons l ON l.section_id = s.id
                LEFT JOIN user_lessons ul ON ul.lesson_id = l.id
                WHERE s.course_id = $1
                GROUP BY s.id, s.name, us.section_id,us.is_completed`,
                [courseId, userId]
            );
            return section;
        } catch (error) {
            throw error;
        }
    }
    

    async updateSection(info) {
        try {
            const section = await db.query(
                `UPDATE sections SET name = $1 WHERE id = $2 RETURNING id, name, course_id as courseId`,
                [info.name, info.id],
            )

            return section
        } catch (error) {
            if (error.code === '23503') {
                throw { status: 409, message: 'Раздел с таким названием уже существует' }
            }
            throw error
        }
    }

    async deleteSection(id) {
        try {
            await db.query(`DELETE FROM sections WHERE id = $1`, [id])
        } catch (error) {
            throw error
        }
    }
}

module.exports = new SectionsModel()
