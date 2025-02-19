const Router = require('express')
const router = new Router()

const userController = require('../controllers/users.controllers')
const tokenController = require('../controllers/tokens.controller')
const checkToken = require('../middlewares/checkToken')

router.post('/users/create', userController.createUser)
router.post('/users/newTokens', tokenController.updateRefreshToken)
router.post('/users/verifyEmail', checkToken, userController.verifyEmail)

router.post('/users/login', userController.loginUser)
router.post('/users/resetPassword', userController.resetUserPassword)
router.post('/users/updatePassword', checkToken, userController.newUserPassword)

module.exports = router
