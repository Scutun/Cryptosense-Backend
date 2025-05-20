const coursesService = require('../services/courses.services')
const tokenUtils = require('../utils/tokens.utils')
const fs = require('fs')
const path = require('path')

class CoursesController {
    async createCourse(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const courseId = await coursesService.createCourse(req.body, userId, req.file.filename)
            const info = await coursesService.getCourseInfoById(courseId)
            res.json(info)
        } catch (error) {
            next(error)
        }
    }

    async deleteCourse(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            await coursesService.getCourseInfoById(req.params.id)
            await coursesService.deleteCourse(req.params.id, userId)
            res.json({ message: 'Курс удален' })
        } catch (error) {
            next(error)
        }
    }

    async updateCourse(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const existingCourse = await coursesService.getCourseInfoById(req.body.courseId)

            if (req.file) {
                const oldPhotoFileName = existingCourse.photo

                if (oldPhotoFileName && typeof oldPhotoFileName === 'string') {
                    const oldPhotoPath = path.join('uploads/course', oldPhotoFileName)

                    if (fs.existsSync(oldPhotoPath)) {
                        fs.unlinkSync(oldPhotoPath)
                    }
                }

                req.body.coursePhoto = req.file.filename
            } else {
                req.body.coursePhoto = existingCourse.photo || null
            }

            const courseId = await coursesService.updateCourse(req.body, userId)
            const info = await coursesService.getCourseInfoById(courseId)
            res.json(info)
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

    async addSubscription(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            await coursesService.addCourseSubscriber(req.body.id, userId)
            res.status(200).json({ message: 'Вы подписались на курс' })
        } catch (error) {
            next(error)
        }
    }

    async removeSubscription(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            await coursesService.removeCourseSubscriber(req.params.id, userId)
            res.status(200).json({ message: 'Вы отписались от курса' })
        } catch (error) {
            next(error)
        }
    }

    async courseCheckSubscription(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const isSubscribed = await coursesService.courseCheckSubscription(req.params.id, userId)
            res.status(200).json(isSubscribed)
        } catch (error) {
            next(error)
        }
    }

    async getCoursesByAuthorId(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const courses = await coursesService.getCoursesByAuthorId(userId, req.query)

            res.status(200).json(courses)
        } catch (error) {
            next(error)
        }
    }

    async changeReleasedStatus(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const released = await coursesService.changeReleasedStatus(req.body.courseId, userId)
            res.status(200).json({
                message: released ? 'Курс опубликован' : 'Курс снят с публикации',
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CoursesController()
