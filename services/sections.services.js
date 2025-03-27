const sectionsModel = require('../models/sections.models')
const coursesModel = require('../models/courses.models')
const lessonsModel = require('../models/lessons.models')
const testsModel = require('../models/tests.models')

class SectionsService {
    async createSection(info, user) {
        try {
            const course = await coursesModel.getCourseById(info.courseId)

            if (course.rowCount === 0) {
                throw { status: 404, message: 'Курса с таким id не существует' }
            }

            if (course.rows[0].creator_id != user) {
                throw { status: 406, message: 'Вы не являетесь создателем этого курса' }
            }

            if (info.name.length === 0) {
                throw { status: 400, message: 'Название раздела не предоставлено' }
            }

            const section = await sectionsModel.createSection(info)

            return section
        } catch (error) {
            throw error
        }
    }

    async getSections(id) {
        try {
            if (id.length === 0) {
                throw { status: 400, message: 'Id курса не предоставлен' }
            }

            const sections = await sectionsModel.getSections(id)

            if (sections.rowCount === 0) {
                throw { status: 404, message: 'У этого курса пока нет раздела' }
            }

            return sections.rows
        } catch (error) {
            throw error
        }
    }

    async getSectionByIdWithAuthorization(userId, courseId) {
        try {
            if (courseId.length === 0) {
                throw { status: 400, message: 'Id курса не предоставлен' }
            }

            const section = await sectionsModel.getSectionByIdWithAuthorization(userId, courseId)

            if (section.rowCount === 0) {
                throw { status: 404, message: 'У этого курса пока нет раздела' }
            }
            return section.rows
        } catch (error) {
            throw error
        }
    }

    async updateSection(info, user) {
        try {
            const course = await coursesModel.getCourseById(info.courseId)

            const data = await sectionsModel.getSectionById(info.id)

            if (course.rowCount === 0 || data.rowCount === 0) {
                throw { status: 404, message: 'Курса или раздела с таким id не существует' }
            }

            if (course.rows[0].creator_id != user) {
                throw { status: 406, message: 'Вы не являетесь создателем этого курса' }
            }

            if (info.name.length === 0) {
                throw { status: 400, message: 'Название раздела не предоставлено' }
            }

            const section = await sectionsModel.updateSection(info)
            return section.rows[0]
        } catch (error) {
            throw error
        }
    }

    async deleteSection(id, user) {
        try {
            const section = await sectionsModel.getSectionById(id)

            const course = await coursesModel.getCourseById(section.rows[0].courseid)

            if (course.rowCount === 0 || section.rowCount === 0) {
                throw { status: 404, message: 'Курса или раздела с таким id не существует' }
            }

            if (course.rows[0].creator_id != user) {
                throw { status: 406, message: 'Вы не являетесь создателем этого курса' }
            }

            await sectionsModel.deleteSection(id)
            await lessonsModel.deleteAllLessonsBySectionId(id)
            await testsModel.deleteAllTestsBySectionId(id)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new SectionsService()
