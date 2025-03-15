const lessonsService = require('../services/lessons.services')
const tokenUtils = require('../utils/tokens.utils')

class LessonsController {
    async createLesson(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const lessonId = await lessonsService.createLesson(req.body, userId)
            res.status(201).json(lessonId)
        } catch (error) {
            next(error)
        }
    }

    async getAllLessonsNames(req, res, next) {
        try {
            const lessons = await lessonsService.getAllLessonsNameFromSection(req.params.id)
            res.status(200).json(lessons)
        } catch (error) {
            next(error)
        }
    }

    async getLessonById(req, res, next) {
        try {
            const lesson = await lessonsService.getLessonById(req.params.id)
            res.status(200).json(lesson)
        } catch (error) {
            next(error)
        }
    }

    async updateLesson(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            const lesson = await lessonsService.updateLesson(req.body, userId)
            res.status(200).json(lesson)
        } catch (error) {
            next(error)
        }
    }

    async deleteLesson(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            await lessonsService.deleteLesson(req.body, userId)
            res.status(201).json({ message: 'Урок успешно удален' })
        } catch (error) {
            next(error)
        }
    }
    async finishLesson(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)
            await lessonsService.finishLesson(req.body.id, userId)
            res.status(201).json({ message: 'Урок успешно завершен' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new LessonsController()
