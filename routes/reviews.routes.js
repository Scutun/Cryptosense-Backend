const Router = require('express')
const router = new Router()

const reviewsController = require('../controllers/reviews.controllers')
const checkToken = require('../middlewares/checkToken')

router.get('/v1/reviews/course', reviewsController.getReviewByCourseId)

router.use('/v1/reviews', checkToken)

router.post('/v1/reviews', reviewsController.createReview)

router.get('/v1/reviews/:id', reviewsController.getReviewByUserId)

router.put('/v1/reviews', reviewsController.changeReview)

router.delete('/v1/reviews/:id', reviewsController.deleteReview)

module.exports = router
