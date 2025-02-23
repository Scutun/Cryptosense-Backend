const Router = require('express')
const router = new Router()

const reviewController = require('../controllers/reviews.controllers')
const checkToken = require('../middlewares/checkToken')

router.get('/v1/reviews/course/:id', reviewController.getReviewByCourseId)

module.exports = router
