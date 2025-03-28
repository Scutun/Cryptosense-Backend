const testsModel = require('../models/tests.models')
const lessonsModel = require('../models/lessons.models')

class TestsService {
    async createTest(info, creatorId) {
        try {
            if (
                !info.name ||
                !info.sectionId ||
                !info.courseId ||
                !info.questions ||
                !creatorId ||
                info.questions.length === 0
            ) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }

            if (info.questions?.length > 64) {
                throw {
                    status: 413,
                    message:
                        'Слишком много вопросов. Максимально допустимое количество вопросов - 64',
                }
            }

            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)

            const test = await testsModel.createTest(
                info.name,
                info.sectionId,
                info.courseId,
                info.questions,
            )

            const { _id, ...rest } = test
            const newTest = { testId: _id, ...rest }

            return newTest
        } catch (error) {
            throw error
        }
    }

    async getTestsBySectionId(sectionId, userId) {
        try {
            if (!sectionId) {
                throw { status: 400, message: 'Не передан id секции' }
            }

            const tests = await testsModel.getTestsBySectionId(sectionId, userId)

            if (tests.length === 0) {
                throw { status: 404, message: 'В этом разделе нет тестов' }
            }

            return tests
        } catch (error) {
            throw error
        }
    }

    async getTestInfoById(testId, page, limit, userId) {
        try {
            if (!testId) {
                throw { status: 400, message: 'Не передан id теста' }
            }
            await lessonsModel.checkLessonAccess(testId, userId)
            const test = await testsModel.getTestInfoById(testId, userId)

            if (!test) {
                throw { status: 404, message: 'Тест не найден' }
            }

            const { _id, info, ...rest } = test
            const modifiedTest = { testId: _id, ...rest }

            if (!page || !limit) {
                return modifiedTest
            }

            // Пагинация
            const questions = test.questions.slice((page - 1) * limit, page * limit)

            // Возвращаем тест с пагинированными вопросами
            return {
                pages: Math.ceil(test.questions.length / limit),
                ...modifiedTest,
                questions,
                totalQuestions: test.questions.length,
            }
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
                !info.questions ||
                !creatorId ||
                info.questions.length === 0
            ) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }

            if (info.questions?.length > 64) {
                throw {
                    status: 413,
                    message:
                        'Слишком много вопросов. Максимально допустимое количество вопросов - 64',
                }
            }

            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)

            await testsModel.updateTest(info.testId, info.name, info.sectionId, info.questions)
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
