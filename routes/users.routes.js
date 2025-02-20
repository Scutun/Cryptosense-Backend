const Router = require('express')
const router = new Router()

const userController = require('../controllers/users.controllers')
const tokenController = require('../controllers/tokens.controller')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/users/create', userController.createUser)
router.post('/v1/users/verify/email', checkToken, userController.verifyEmail)
router.post('/v1/users/login', userController.loginUser)
router.post('/v1/users/reset/password', userController.resetUserPassword)
router.post('/v1/users/update/password', checkToken, userController.newUserPassword)

router.get('/v1/users/new/tokens', tokenController.updateRefreshToken)

module.exports = router
