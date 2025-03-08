const db = require('../config/db').pool
const mongoDb = require('../config/db').mongoDb
const { connectMongoDB } = require('../config/db')

class LessonsModel {
    async createLesson(name, sectionId, courseId, info) {
        try {
            const lessonId = await db.query(
                'INSERT INTO lessons (section_id, name, is_test) VALUES ($1, $2, $3) RETURNING id',
                [sectionId, name, 'false'],
            )

            const newLesson = {
                _id: lessonId.rows[0].id,
                sectionId: sectionId,
                courseId: courseId,
                info: info,
            }

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').insertOne(newLesson)
            
            return newLesson
        } catch (error) {
            if (error.code === '23503') {
                throw { status: 400, message: 'Раздела с таким id не существует' }
            }
            throw error
        }
    }

    async checkAuthor(courseId, sectionId, userId) {
        try {
            const course = await db.query(
                `SELECT courses.id FROM sections 
                 LEFT JOIN courses ON sections.course_id = courses.id 
                 WHERE courses.creator_id = $1 AND sections.id = $2 AND courses.id = $3`,
                [userId, sectionId, courseId],
            )

            if (course.rowCount === 0) {
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
            const lesson = await mongoDb.collection('lessons').findOne({ _id: Number(lessonId) })

            if (lesson) return lesson
            throw { status: 404, message: 'Урок не найден' }
        } catch (error) {
            throw error
        }
    }

    async updateLesson(lessonId, name, sectionId, content) {
        try {
            await db.query('UPDATE lessons SET name=$1,section_id=$3 WHERE id=$2', [
                name,
                lessonId,
                sectionId,
            ])

            const mongoDb = await connectMongoDB()

            await mongoDb
                .collection('lessons')
                .updateOne(
                    { _id: Number(lessonId) },
                    { $set: { info: content, sectionId: sectionId } },
                )
        } catch (error) {
            throw error
        }
    }

    async deleteLesson(lessonId) {
        try {
            await db.query('DELETE FROM lessons WHERE id=$1', [lessonId])

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').deleteOne({ _id: Number(lessonId) })
        } catch (error) {
            throw error
        }
    }

    async deleteAllLessonsBySectionId(sectionId) {
        try {
            await db.query('DELETE FROM lessons WHERE section_id=$1', [sectionId])

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').deleteMany({ sectionId: Number(sectionId) })
        } catch (error) {
            throw error
        }
    }

    async deleteAllLessonsByCourseId(courseId) {
        try {
            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').deleteMany({ courseId: Number(courseId) })
        } catch (error) {
            throw error
        }
    }
}

module.exports = new LessonsModel()
