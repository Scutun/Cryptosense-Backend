const lessonsModel = require('../models/lessons.models')

class LessonsService {
    async createLesson(info, creatorId) {
        try {
            if (
                !info.name ||
                !info.sectionId ||
                !info.courseId ||
                !info.info ||
                !creatorId ||
                Object.keys(info.info).length === 0
            ) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }
            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)
            const lesson = await lessonsModel.createLesson(
                info.name,
                info.sectionId,
                info.courseId,
                info.info,
            )
            const { _id, ...rest } = lesson
            const newLesson = { lessonId: _id, ...rest }
            return newLesson
        } catch (error) {
            throw error
        }
    }

    async getAllLessonsNameFromSection(sectionId) {
        try {
            if (!sectionId) {
                throw { status: 400, message: 'Не передан id секции' }
            }
            const lessons = await lessonsModel.getAllLessonsNameFromSection(sectionId)
            return lessons
        } catch (error) {
            throw error
        }
    }

    async getLessonById(lessonId) {
        try {
            if (!lessonId) {
                throw { status: 400, message: 'Не передан id урока' }
            }
            const lesson = await lessonsModel.getLessonById(lessonId)
            const { _id, ...rest } = lesson
            const newLesson = { lessonId: _id, ...rest }
            return newLesson
        } catch (error) {
            throw error
        }
    }

    async updateLesson(info, creatorId) {
        try {
            if (
                !info.lessonId ||
                !info.name ||
                !info.sectionId ||
                !info.courseId ||
                !info.info ||
                !creatorId ||
                Object.keys(info.info).length === 0
            ) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }
            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)
            await lessonsModel.updateLesson(info.lessonId, info.name, info.sectionId, info.info)
            return info
        } catch (error) {
            throw error
        }
    }

    async deleteLesson(info, creatorId) {
        try {
            if (!info.lessonId || !creatorId || !info.sectionId || !info.courseId) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }
            await lessonsModel.checkAuthor(info.courseId, info.sectionId, creatorId)
            await lessonsModel.deleteLesson(info.lessonId)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new LessonsService()
