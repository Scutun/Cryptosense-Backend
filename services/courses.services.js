const coursesModel = require('../models/courses.models')

class CoursesService {
    async createCourse(info, creatorId) {
        try {
            if (
                !info.title ||
                !creatorId ||
                !info.courseDuration ||
                !info.difficultyId ||
                !info.courseDuration ||
                info.tags.length === 0
            ) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }

            const courseId = await coursesModel.createCourse(info, creatorId)

            const tags = info.tags.map((num) => [courseId, num])

            await coursesModel.addCourseTags(courseId, tags)

            return courseId
        } catch (error) {
            throw error
        }
    }

    async deleteCourse(courseId, userId) {
        try {
            if (courseId.length === 0 || userId.length === 0) {
                throw { status: 400, message: 'Не все поля заполнены' }
            }

            await coursesModel.deleteCourse(courseId, userId)
        } catch (error) {
            throw error
        }
    }

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

    async getCourses(query) {
        try {
            const limit = parseInt(query.limit, 10)
            const offset = parseInt(query.offset, 10)
            const sort = query.sort
            const order = query.order
            const sortCondition = ''

            if (isNaN(limit) || isNaN(offset)) {
                throw { status: 400, message: 'Неверные значения limit или offset' }
            }

            if (
                (sort !== 'follow' && sort !== 'creation') ||
                (order !== 'asc' && order !== 'desc')
            ) {
                const courses = await coursesModel.getAllCourses(limit, offset)

                if (courses.total === 0) {
                    throw { status: 404, message: 'Курсы не найдены' }
                }

                return courses
            } else {
                if (sort === 'follow') {
                    sortCondition = 'subscribers'
                } else {
                    sortCondition = 'course_duration'
                }

                const courses = await coursesModel.getSortedCourses(
                    limit,
                    offset,
                    sortCondition,
                    order,
                )

                if (courses.total === 0) {
                    throw { status: 404, message: 'Курсы не найдены' }
                }

                return courses
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new CoursesService()
