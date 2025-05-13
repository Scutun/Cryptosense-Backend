const Router = require('express')
const router = new Router()

const coursesController = require('../controllers/courses.controllers')
const checkToken = require('../middlewares/checkToken')
const uploadCourseImage = require('../middlewares/uploadCourseImage')

router.get('/v1/courses/info/:id', coursesController.getCourseInfoById)
router.get('/v1/courses/list', coursesController.getCourses)

router.use('/v1/courses', checkToken)

router.post('/v1/courses/new', uploadCourseImage, coursesController.createCourse)
router.post('/v1/courses/sub', coursesController.addSubscription)

router.get('/v1/courses/chosen', coursesController.getChosenCourses)
router.get('/v1/courses/check/sub/:id', coursesController.courseCheckSubscription)

router.put('/v1/courses', coursesController.updateCourse)

router.delete('/v1/courses/:id', coursesController.deleteCourse)
router.delete('/v1/courses/unsub/:id', coursesController.removeSubscription)

module.exports = router
