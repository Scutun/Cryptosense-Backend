const db = require('../config/db').pool

class SectionsModel {
    async createSection(info) {
        try {
            const section = await db.query(
                `INSERT INTO sections (name, course_id) VALUES ($1) RETURNING *`,
                [info.name, info.courseId],
            )

            return section.rows[0]
        } catch (error) {
            throw error
        }
    }

    async getSections(id) {
        try {
            const sections = await db.query(`SELECT * FROM sections where course_id = $1`, [id])

            return sections
        } catch (error) {
            throw error
        }
    }

    async getSectionById(id) {
        try {
            const section = await db.query(`SELECT * FROM sections WHERE id = $1`, [id])

            return section
        } catch (error) {
            throw error
        }
    }

    async updateSection(info) {
        try {
            const section = await db.query(
                `UPDATE sections SET name = $1 WHERE id = $2 RETURNING *`,
                [info.name, info.id],
            )

            return section.rows[0]
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
