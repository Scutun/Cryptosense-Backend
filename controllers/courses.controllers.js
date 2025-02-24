const coursesService = require('../services/courses.services')

class CoursesController {
    async getCourseInfoById(req, res, next) {
        try {
            const info = await coursesService.getCourseInfoById(req.params.id)
            res.json(info)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CoursesController()
