const { json } = require('express')

const db = require('../config/db').pool
const redis = require('../config/db').redisClient

class LessonsModel {
    async createLesson(name, sectionId, info) {
        try {
            const lessonId = await db.query(
                'INSERT INTO lessons (section_id, name, is_test) VALUES ($1, $2, $3) RETURNING id',
                [sectionId, name, 'false'],
            )
            await redis.set(`lesson:${lessonId.rows[0].id}`, {
                courseId: courseId,
                sectionId: sectionId,
                info: JSON.stringify(info),
            })

            return lessonId.rows[0].id
        } catch (error) {
            if (error.code === '23503')
                throw { status: 400, message: 'Раздела с таким id в не существует' }
            throw error
        }
    }

    async checkAuthor(sectionId, userId) {
        try {
            const courseId = await db.query(
                `SELECT courses.id FROM sections LEFT JOIN courses on sections.course_id=courses.id WHERE courses.creator_id = $1 and sections.id=$2`,
                [userId, sectionId],
            )
            if (courseId.rowCount == 0)
                throw {
                    status: 403,
                    message: 'У вас недостаточно прав для редактирования этого курса',
                }
        } catch (error) {
            throw error
        }
    }

    async getAllLessonsNameFromSection(sectionId) {
        try {
            const lessons = await db.query('SELECT id, name FROM lessons WHERE section_id=$1', [
                sectionId,
            ])
            return lessons.rows
        } catch (error) {
            throw error
        }
    }

    async getLessonById(lessonId) {
        try {
            const lesson = await redis.get(`lesson:${lessonId}`)
            if (lesson) return JSON.parse(lesson)
            else throw { status: 404, message: 'Урок не найден' }
        } catch (error) {
            throw error
        }
    }

    async updateLesson(lessonId, info, name) {
        try {
            await db.query('UPDATE lessons SET name=$1 WHERE id=$2', [name, lessonId])
            await redis.set(`lesson:${lessonId}`, JSON.stringify(info))
        } catch (error) {
            throw error
        }
    }

    async deleteLesson(lessonId) {
        try {
            await db.query('DELETE FROM lessons WHERE id=$1', [lessonId])
            await redis.del(`lesson:${lessonId}`)
        } catch (error) {
            throw error
        }
    }

    async deleteAllLessonsBySectionId(sectionId) {
        try {
            await db.query('DELETE FROM lessons WHERE section_id=$1', [sectionId])
            
            await redis.del(`lessons:${sectionId}`)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new LessonsModel()
