const Router = require('express')
const router = new Router()

const photosUtils = require('../utils/photos.utils')
const expressStatic = require('express').static
const { serveCoursePhoto, courseUploadsPath } = require('../utils/photos.utils')

const checkToken = require('../middlewares/checkToken')

router.get('/v1/profiles/avatars/all', checkToken, photosUtils.getPhotos)

router.use('/v1/courses/photo/url', serveCoursePhoto)

router.use('/v1/courses/photo/url', expressStatic(courseUploadsPath))

module.exports = router
