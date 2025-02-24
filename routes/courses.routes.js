const Router = require('express')
const router = new Router()

const coursesController = require('../controllers/courses.controllers')
const checkToken = require('../middlewares/checkToken')

router.get('/v1/courses/info/:id', coursesController.getCourseInfoById)

module.exports = router
