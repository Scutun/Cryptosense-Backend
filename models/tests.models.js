const db = require('../config/db').pool
const { connectMongoDB } = require('../config/db')

class TestsModel {
    async createTest(name, sectionId, courseId, info) {
        try {
            const testId = await db.query(
                'INSERT INTO lessons (section_id, name, is_test) VALUES ($1, $2, $3) RETURNING id',
                [sectionId, name, 'true'],
            )

            const newTest = {
                _id: testId.rows[0].id,
                sectionId: sectionId,
                courseId: courseId,
                questions: info,
            }

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('tests').insertOne(newTest)

            return newTest
        } catch (error) {
            if (error.code === '23503') {
                throw { status: 404, message: 'Раздела с таким id не существует' }
            }
            throw error
        }
    }

    async getTestsBySectionId(sectionId, userId) {
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
                    WHERE l.section_id = $1 and l.is_test=true;`,
                [sectionId, userId],
            )
            return lessons.rows
        } catch (error) {
            throw error
        }
    }

    async getTestInfoById(testId, userId) {
        try {
            const isComplete = await db.query(
                'SELECT * FROM user_lessons WHERE user_id = $1 AND lesson_id = $2',
                [userId, testId],
            )
            const isCompleted = isComplete.rowCount > 0 ? true : false

            const info = await db.query(`SELECT name FROM lessons WHERE id = $1`, [testId])

            const mongoDb = await connectMongoDB()
            const test = await mongoDb.collection('tests').findOne({ _id: Number(testId) })

            if (!test) throw { status: 404, message: 'Тест не найден' }
            return Object.assign({ name: info.rows[0].name, isCompleted: isCompleted }, test)
        } catch (error) {
            throw error
        }
    }

    async updateTest(testId, name, sectionId, info) {
        try {
            await db.query('UPDATE lessons SET name=$1,section_id=$3 WHERE id=$2', [
                name,
                testId,
                sectionId,
            ])

            const mongoDb = await connectMongoDB()

            await mongoDb
                .collection('tests')
                .updateOne(
                    { _id: Number(testId) },
                    { $set: { questions: info, sectionId: sectionId } },
                )
        } catch (error) {
            throw error
        }
    }

    async deleteTest(testId) {
        try {
            await db.query('DELETE FROM lessons WHERE id=$1', [testId])

            const mongoDb = await connectMongoDB()
            await mongoDb.collection('tests').deleteOne({ _id: Number(testId) })
        } catch (error) {
            throw error
        }
    }

    async deleteAllTestsByCoursesId(courseId) {
        try {
            const mongoDb = await connectMongoDB()
            await mongoDb.collection('tests').deleteMany({ sectionId: Number(courseId) })
        } catch (error) {
            throw error
        }
    }

    async deleteAllTestsBySectionId(sectionId) {
        try {
            const mongoDb = await connectMongoDB()
            await mongoDb.collection('tests').deleteMany({ sectionId: Number(sectionId) })
        } catch (error) {
            throw error
        }
    }
}

module.exports = new TestsModel()
