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
                info: info,
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

    async getTestsBySectionId(sectionId) {
        try {
            const mongoDb = await connectMongoDB()
            const tests = await mongoDb
                .collection('tests')
                .find({ sectionId: Number(sectionId) })
                .toArray()
            return tests
        } catch (error) {
            throw error
        }
    }

    async getTestInfoById(testId) {
        try {
            const mongoDb = await connectMongoDB()
            const test = await mongoDb.collection('tests').findOne({ _id: Number(testId) })

            if (!test) throw { status: 404, message: 'Тест не найден' }
            return test
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
                .updateOne({ _id: Number(testId) }, { $set: { info: info, sectionId: sectionId } })
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
}

module.exports = new TestsModel()
