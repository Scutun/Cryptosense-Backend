const Router = require('express')
const router = new Router()

const lessonsController = require('../controllers/lessons.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/lessons/new', checkToken, lessonsController.createLesson)
router.post('/v1/lessons/fin', checkToken, lessonsController.finishLesson)

router.get('/v1/lessons/list/:id', checkToken, lessonsController.getAllLessonsNames)
router.get('/v1/lessons/info/:id', checkToken, lessonsController.getLessonById)

router.put('/v1/lessons/redact', checkToken, lessonsController.updateLesson)

router.delete('/v1/lessons', checkToken, lessonsController.deleteLesson)

module.exports = router
