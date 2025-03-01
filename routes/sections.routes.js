const Router = require('express')
const router = new Router()

const sectionsController = require('../controllers/sections.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/sections/create', checkToken, sectionsController.createSection)

router.get('/v1/sections/list/:id', sectionsController.getSections)

router.put('/v1/sections/update', checkToken, sectionsController.updateSection)

router.delete('/v1/sections/delete/:id', checkToken, sectionsController.deleteSection)

module.exports = router
