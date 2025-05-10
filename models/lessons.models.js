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
                name: name,
                sectionId: sectionId,
                courseId: courseId,
                info: info,
            }

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('lessons').insertOne(newLesson)

            return newLesson
        } catch (error) {
            if (error.code === '23503') {
                throw { status: 404, message: 'Раздела с таким id не существует' }
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

    async getAllLessonsNameFromSection(sectionId, userId) {
        try {
            const lessons = await db.query(
                `SELECT 
                    l.id, 
                    l.name,
                    CASE 
                        WHEN ul.lesson_id IS NOT NULL THEN TRUE 
                        ELSE FALSE 
                    END AS isCompleted
                FROM lessons l
                LEFT JOIN user_lessons ul 
                    ON l.id = ul.lesson_id AND ul.user_id = $2
                WHERE l.section_id = $1 and l.is_test=false;`,
                [sectionId, userId],
            )
            return lessons.rows
        } catch (error) {
            throw error
        }
    }

    async getLessonById(lessonId, userId) {
        try {
            const isComplete = await db.query(
                'SELECT * FROM user_lessons WHERE user_id = $1 AND lesson_id = $2',
                [userId, lessonId],
            )
            const isCompleted = isComplete.rowCount > 0 ? true : false

            const info = await db.query(`SELECT name FROM lessons WHERE id = $1`, [lessonId])

            const mongoDb = await connectMongoDB()
            const lesson = await mongoDb.collection('lessons').findOne({ _id: Number(lessonId) })

            if (lesson)
                return Object.assign({ name: info.rows[0].name, isCompleted: isCompleted }, lesson)
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

    async finishLesson(userId, lessonId) {
        try {
            const result = await db.query(
                `INSERT INTO user_lessons (user_id, lesson_id)
                 SELECT $1, $2
                 FROM user_courses
                 WHERE user_id = $1 
                   AND course_id = (
                       SELECT s.course_id
                       FROM lessons l
                       JOIN sections s ON l.section_id = s.id
                       WHERE l.id = $2
                   )
                   AND active = TRUE
                 
                 RETURNING *`,
                [userId, lessonId],
            )

            if (result.rowCount === 0) {
                throw { status: 406, message: 'Пользователь не подписан на данный курс' }
            }
        } catch (error) {
            if (error.code === '23505') {
                throw { status: 409, message: 'Урок уже завершен' }
            }
            throw error
        }
    }

    async checkLessonAccess(lessonId, userId) {
        try {
            const lessonOpened = await db.query(
                'SELECT us.is_unlocked FROM user_sections us LEFT JOIN lessons l ON l.section_id = us.section_id WHERE l.id = $1 AND us.user_id = $2',
                [lessonId, userId],
            )

            if (lessonOpened.rowCount === 0) {
                throw {
                    status: 423,
                    message: 'Завершите предыдущую секцию для просмотра содержимого следующей',
                }
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new LessonsModel()
