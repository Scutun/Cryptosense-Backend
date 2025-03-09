const testsModel = require('../models/tests.models')
const lessonsModel = require('../models/lessons.models')

class TestsService {
    async createTest(info, creatorId) {
        try {
            if (
                !info.name ||
                !info.sectionId ||
                !info.courseId ||
                !info.info ||
                !creatorId ||
                Object.keys(info.info).length === 0
            ) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }

            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)

            const test = await testsModel.createTest(
                info.name,
                info.sectionId,
                info.courseId,
                info.info,
            )

            const { _id, ...rest } = test
            const newTest = { testId: _id, ...rest }

            return newTest
        } catch (error) {
            throw error
        }
    }

    async getTestsBySectionId(sectionId) {
        try {
            if (!sectionId) {
                throw { status: 400, message: 'Не передан id секции' }
            }

            const tests = await testsModel.getTestsBySectionId(sectionId)
            const modifiedTests = tests.map(({ _id, ...rest }) => ({ testId: _id, ...rest }))

            return modifiedTests
        } catch (error) {
            throw error
        }
    }

    async getTestInfoById(testId) {
        try {
            if (!testId) {
                throw { status: 400, message: 'Не передан id теста' }
            }

            const test = await testsModel.getTestInfoById(testId)

            const { _id, ...rest } = test
            const modifiedTest = { testId: _id, ...rest }

            return modifiedTest
        } catch (error) {
            throw error
        }
    }

    async updateTest(info, creatorId) {
        try {
            if (
                !info.testId ||
                !info.name ||
                !info.sectionId ||
                !info.courseId ||
                !info.info ||
                !creatorId ||
                Object.keys(info.info).length === 0
            ) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }

            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)

            await testsModel.updateTest(info.testId, info.name, info.sectionId, info.info)
            return info
        } catch (error) {
            throw error
        }
    }

    async deleteTest(info, creatorId) {
        try {
            if (!info.testId || !creatorId || !info.sectionId || !info.courseId) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }

            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)

            await testsModel.deleteTest(info.testId)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new TestsService()
