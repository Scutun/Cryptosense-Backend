const Router = require('express')
const router = new Router()

const reviewsController = require('../controllers/reviews.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/reviews/create', checkToken, reviewsController.createReview)

router.get('/v1/reviews/all', reviewsController.getAllReviews)

router.patch('/v1/reviews/change', checkToken, reviewsController.changeReview)

router.delete('/v1/reviews/delete', checkToken, reviewsController.deleteReview)

module.exports = router
