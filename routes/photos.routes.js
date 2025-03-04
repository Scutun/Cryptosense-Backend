const Router = require('express')
const router = new Router()

const photosUtils = require('../utils/photos.utils')
const checkToken = require('../middlewares/checkToken')

router.get('/v1/profiles/avatars/all', checkToken, photosUtils.getPhotos)

module.exports = router
