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
}

module.exports = new CoursesService()
