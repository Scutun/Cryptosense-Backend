const Router = require('express')
const router = new Router()

const checkToken = require('../middlewares/checkToken')

router.post('/v1/lessons/new', checkToken, coursesController.createLesson)

router.get('/v1/lessons/list/:id',checkToken, coursesController.getLessonInfoById)

router.put('/v1/lessons/:id', checkToken, coursesController.updateLesson)

router.delete('/v1/lessons/:id', checkToken, coursesController.deleteLesson)


module.exports = router
