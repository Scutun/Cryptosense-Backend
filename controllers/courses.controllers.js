const coursesService = require('../services/courses.services')
const tokenUtils = require('../utils/tokens.utils')

class CoursesController {
    async createCourse(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const courseId = await coursesService.createCourse(req.body, userId)
            const info = await coursesService.getCourseInfoById(courseId)
            res.json(info)
        } catch (error) {
            next(error)
        }
    }

    async deleteCourse(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            await coursesService.getCourseInfoById(req.body.courseId)
            await coursesService.deleteCourse(req.body.courseId, userId)
            res.json({ message: 'Курс удален' })
        } catch (error) {
            next(error)
        }
    }

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
