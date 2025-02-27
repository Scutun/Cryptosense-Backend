const Router = require('express')
const router = new Router()

const coursesController = require('../controllers/courses.controllers')
const checkToken = require('../middlewares/checkToken')

router.get('/v1/courses/info/:id', coursesController.getCourseInfoById)
router.get('/v1/courses/chosen', checkToken, coursesController.getChosenCourses)

module.exports = router
