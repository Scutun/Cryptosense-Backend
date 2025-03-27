const Router = require('express')
const router = new Router()

const authorsController = require('../controllers/authors.controllers')

router.post('/v1/authors', authorsController.becomeAuthor)

router.get('/v1/authors/:id', authorsController.getAuthorById)

module.exports = router
