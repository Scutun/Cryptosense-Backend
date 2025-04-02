const Router = require('express')
const router = new Router()

const sectionsController = require('../controllers/sections.controllers')
const checkToken = require('../middlewares/checkToken')

router.get('/v1/sections/list/:id', sectionsController.getSections)

router.use('/v1/sections', checkToken)

router.post('/v1/sections/new', sectionsController.createSection)

router.get('/v1/sections/user/list/:id', sectionsController.getSectionWithToken)

router.put('/v1/sections', sectionsController.updateSection)

router.delete('/v1/sections/:id', sectionsController.deleteSection)

module.exports = router
