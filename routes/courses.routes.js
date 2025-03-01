const Router = require('express')
const router = new Router()

const coursesController = require('../controllers/courses.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/courses/create', checkToken, coursesController.createCourse)

router.get('/v1/courses/info/:id', coursesController.getCourseInfoById)
router.get('/v1/courses/chosen', checkToken, coursesController.getChosenCourses)
router.get('/v1/courses/list', coursesController.getCourses)

router.delete('/v1/courses/delete', checkToken, coursesController.deleteCourse)

module.exports = router
