const Router = require('express')
const router = new Router()

const sectionsController = require('../controllers/sections.controllers')
const checkToken = require('../middlewares/checkToken')

router.post('/v1/sections/new', checkToken, sectionsController.createSection)

router.get('/v1/sections/list/:id', sectionsController.getSections)
router.get('/v1/sections/user/list/:id',checkToken, sectionsController.getSectionWithToken)

router.put('/v1/sections', checkToken, sectionsController.updateSection)

router.delete('/v1/sections/:id', checkToken, sectionsController.deleteSection)

module.exports = router
