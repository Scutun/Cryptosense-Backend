const Router = require('express')
const router = new Router()

const testController = require('../controllers/tests.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/tests/new', checkToken, testController.createTest)

router.get('/v1/tests/list/:id', checkToken, testController.getTestsBySectionId)
router.get('/v1/tests/info', checkToken, testController.getTestInfoById)

router.put('/v1/tests/redact', checkToken, testController.updateTest)

router.delete('/v1/tests', checkToken, testController.deleteTest)
// /v1/tests?lessonId=1&sectionId=1&courseId=1
module.exports = router
