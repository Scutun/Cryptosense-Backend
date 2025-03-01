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

    async updateSection(info) {
        try {
            const section = await db.query(
                `UPDATE sections SET name = $1 WHERE id = $2 RETURNING id, name, course_id as courseId`,
                [info.name, info.id],
            )

            return section
        } catch (error) {
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
