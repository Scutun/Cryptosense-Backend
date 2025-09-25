const Router = require('express')
const router = new Router()

const testController = require('../controllers/tests.controllers')
const checkToken = require('../middlewares/checkToken')

router.use('/v1/tests', checkToken)

router.post('/v1/tests/new', testController.createTest)

router.get('/v1/tests/list/:id', testController.getTestsBySectionId)
router.get('/v1/tests/info', testController.getTestInfoById)

router.put('/v1/tests/redact', testController.updateTest)

router.delete('/v1/tests', testController.deleteTest)

module.exports = router
