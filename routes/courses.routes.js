const Router = require('express')
const router = new Router()

const coursesController = require('../controllers/courses.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/courses/new', checkToken, coursesController.createCourse)
router.post('/v1/courses/sub', checkToken, coursesController.addSubscription)

router.get('/v1/courses/info/:id', coursesController.getCourseInfoById)
router.get('/v1/courses/chosen', checkToken, coursesController.getChosenCourses)
router.get('/v1/courses/list', coursesController.getCourses)

router.put('/v1/courses', checkToken, coursesController.updateCourse)

router.delete('/v1/courses/:id', checkToken, coursesController.deleteCourse)
router.delete('/v1/courses/unsub/:id', checkToken, coursesController.removeSubscription)

module.exports = router
