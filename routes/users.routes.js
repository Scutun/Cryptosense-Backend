const Router = require('express')
const router = new Router()

const userController = require('../controllers/users.controllers')
const tokenController = require('../controllers/tokens.controller')
const checkToken = require('../middlewares/checkToken')

routes.post('/users/newTokens', tokenController.updateRefreshToken)
router.use('/users', checkToken)

router.post('/users/create', userController.createUser)
router.post('/users/login', userController.loginUser)
