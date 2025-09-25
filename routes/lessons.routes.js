const Router = require('express')
const router = new Router()

const lessonsController = require('../controllers/lessons.controllers')
const checkToken = require('../middlewares/checkToken')

router.use('/v1/lessons', checkToken)

router.post('/v1/lessons/new', lessonsController.createLesson)
router.post('/v1/lessons/end', lessonsController.finishLesson)

router.get('/v1/lessons/list/:id', lessonsController.getAllLessonsNames)
router.get('/v1/lessons/info/:id', lessonsController.getLessonById)

router.put('/v1/lessons/redact', lessonsController.updateLesson)

router.delete('/v1/lessons', lessonsController.deleteLesson)

module.exports = router
