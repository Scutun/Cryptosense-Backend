const Router = require('express')
const router = new Router()

const photosUtils = require('../utils/photos.utils')
const checkToken = require('../middlewares/checkToken')
const expressStatic = require('express').static

const { serveCoursePhoto, courseUploadsPath } = require('../utils/photos.utils')

router.use('/v1/courses/photo/url', serveCoursePhoto)

router.use('/v1/courses/photo/url', expressStatic(courseUploadsPath))

router.get('/v1/profiles/avatars/all', checkToken, photosUtils.getPhotos)

module.exports = router
