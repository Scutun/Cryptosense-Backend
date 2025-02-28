const coursesService = require('../services/courses.services')
const tokenUtils = require('../utils/tokens.utils')

class CoursesController {
    async getCourseInfoById(req, res, next) {
        try {
            const info = await coursesService.getCourseInfoById(req.params.id)
            res.json(info)
        } catch (error) {
            next(error)
        }
    }

    async getChosenCourses(req, res, next) {
        try {
            const id = tokenUtils.getIdFromToken(req)
            const courses = await coursesService.getChosenCourses(req.query, id)
            res.json(courses)
        } catch (error) {
            next(error)
        }
    }

    async getCourses(req, res, next) {
        try {
            const courses = await coursesService.getCourses(req.query)
            res.json(courses)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CoursesController()
