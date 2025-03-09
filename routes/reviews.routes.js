const Router = require('express')
const router = new Router()

const reviewsController = require('../controllers/reviews.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/reviews/new', checkToken, reviewsController.createReview)

router.get('/v1/reviews/course/:id', reviewsController.getReviewByCourseId)

router.put('/v1/reviews/redact', checkToken, reviewsController.changeReview)

router.delete('/v1/reviews/:id', checkToken, reviewsController.deleteReview)

module.exports = router
