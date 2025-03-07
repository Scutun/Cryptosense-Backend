const db = require('../config/db').pool
const { connectMongoDB } = require('../config/db')

class LessonsModel {
    async createLesson(name, sectionId, courseId, info) {
        try {
            const lessonId = await db.query(
                'INSERT INTO lessons (section_id, name, is_test) VALUES ($1, $2, $3) RETURNING id',
                [sectionId, name, 'false'],
            )

            const newLesson = {
                lessonId: lessonId.rows[0].id,
                sectionId,
                courseId,
                info,
            }

            const mongoDb = await connectMongoDB() // Подключаемся к MongoDB
            await mongoDb.collection('lessons').insertOne(newLesson)

            return lessonId.rows[0].id
        } catch (error) {
            if (error.code === '23503') {
                throw { status: 400, message: 'Раздела с таким id не существует' }
            }
            throw error
        }
    }

    async checkAuthor(sectionId, userId) {
        try {
            const courseId = await db.query(
                `SELECT courses.id FROM sections 
                 LEFT JOIN courses ON sections.course_id = courses.id 
                 WHERE courses.creator_id = $1 AND sections.id = $2`,
                [userId, sectionId],
            )

            if (courseId.rowCount === 0) {
                throw {
                    status: 403,
                    message: 'У вас недостаточно прав для редактирования этого курса',
                }
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
            const mongoDb = await connectMongoDB()
            const lesson = await mongoDb.collection('lessons').findOne({ lessonId })

            if (lesson) return lesson
            throw { status: 404, message: 'Урок не найден' }
        } catch (error) {
            throw error
        }
    }

    async updateLesson(lessonId, info, name) {
        try {
            await db.query('UPDATE lessons SET name=$1 WHERE id=$2', [name, lessonId])

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').updateOne({ lessonId }, { $set: { info } })
        } catch (error) {
            throw error
        }
    }

    async deleteLesson(lessonId) {
        try {
            await db.query('DELETE FROM lessons WHERE id=$1', [lessonId])

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').deleteOne({ lessonId })
        } catch (error) {
            throw error
        }
    }

    async deleteAllLessonsBySectionId(sectionId) {
        try {
            await db.query('DELETE FROM lessons WHERE section_id=$1', [sectionId])

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').deleteMany({ sectionId })
        } catch (error) {
            throw error
        }
    }

    async deleteAllLessonsByCourseId(courseId) {
        try {
            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').deleteMany({ courseId })
        } catch (error) {
            throw error
        }
    }
}

module.exports = new LessonsModel()
