const Router = require('express')
const router = new Router()

const testController = require('../controllers/tests.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/tests/new', checkToken, testController.createTest)

router.get('/v1/tests/list/:id', checkToken, testController.getTestsBySectionId)
router.get('/v1/tests/info/:id', checkToken, testController.getTestInfoById)

router.put('/v1/tests', checkToken, testController.updateTest)

router.delete('/v1/tests/:id', checkToken, testController.deleteTest)

module.exports = router
