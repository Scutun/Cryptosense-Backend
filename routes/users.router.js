const Router = require("express")
const router = new Router()

const userController = require('../controllers/users.controllers')

router.post("/users/create",userController.createUser)