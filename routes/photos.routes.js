const Router = require('express')
const router = new Router()

const photosUtils = require('../utils/photos.utils')

router.get('/v1/profiles/avatars/all', photosUtils.getPhotos)

module.exports = router
