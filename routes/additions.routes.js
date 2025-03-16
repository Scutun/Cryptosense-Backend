const Router = require('express')
const router = new Router()

const additionsController = require('../controllers/additions.controllers')

router.get('/v1/tags/list', additionsController.getTags)
router.get('/v1/difficulties/list', additionsController.getDifficulties)

module.exports = router
