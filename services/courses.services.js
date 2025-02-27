const coursesModel = require('../models/courses.models')

class CoursesService {
    async getCourseInfoById(id) {
        try {
            if (id.length === 0) {
                throw { status: 400, message: 'Id курса не предоставлен' }
            }
            const info = await coursesModel.getCourseInfoById(id)
            if (!info) {
                throw { status: 404, message: 'Курс не найден' }
            }
            return info
        } catch (error) {
            throw error
        }
    }

    async getChosenCourses(query, id) {
        try {
            const limit = parseInt(query.limit, 10)
            const offset = parseInt(query.offset, 10)
            const status = query.status

            if (isNaN(limit) || isNaN(offset) || (status !== 'active' && status !== 'completed')) {
                throw { status: 400, message: 'Неверные значения limit или offset или status' }
            }

            const statusCondition = status === 'active'

            const info = await coursesModel.getChosenCourses(id, limit, offset, statusCondition)

            if (info.total === 0) {
                throw {
                    status: 404,
                    message: `У этого пользователя нет выбранных курсов со статусом ${status}`,
                }
            }

            return info
        } catch (error) {
            throw error
        }
    }
}

module.exports = new CoursesService()
