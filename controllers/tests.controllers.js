const testsService = require('../services/tests.services')
const tokenUtils = require('../utils/tokens.utils')

class TestsController {
    async createTest(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)

            const testId = await testsService.createTest(req.body, userId)
            res.status(201).json(testId)
        } catch (error) {
            next(error)
        }
    }

    async getTestsBySectionId(req, res, next) {
        try {
            const tests = await testsService.getTestsBySectionId(req.params.id)
            res.status(200).json(tests)
        } catch (error) {
            next(error)
        }
    }

    async getTestInfoById(req, res, next) {
        try {
            const test = await testsService.getTestInfoById(
                req.query.id,
                parseInt(req.query.page, 10),
                parseInt(req.query.limit, 10),
            )
            res.status(200).json(test)
        } catch (error) {
            next(error)
        }
    }

    async updateTest(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)

            const test = await testsService.updateTest(req.body, userId)
            res.status(200).json(test)
        } catch (error) {
            next(error)
        }
    }

    async deleteTest(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)

            await testsService.deleteTest(req.query, userId)
            res.status(200).json({ message: 'Тест успешно удален' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new TestsController()
