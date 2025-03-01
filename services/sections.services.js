const sectionsModel = require('../models/sections.models')

class SectionsService {
    async createSection(info) {
        try {
            if (info.name.length === 0) {
                throw { status: 400, message: 'Название секции не предоставлено' }
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
                throw { status: 404, message: 'У этого курса пока нет разделов' }
            }

            return sections.rows
        } catch (error) {
            throw error
        }
    }

    async updateSection(info) {
        try {
            const data = await sectionsModel.getSectionById(info.id)

            if (data.rowCount === 0) {
                throw { status: 404, message: 'Раздела с таким id не существует' }
            }

            if (info.name.length === 0) {
                throw { status: 400, message: 'Название секции не предоставлено' }
            }

            const section = await sectionsModel.updateSection(info)
            return section.rows[0]
        } catch (error) {
            throw error
        }
    }

    async deleteSection(id) {
        try {
            const section = await sectionsModel.getSectionById(id)

            if (section.rowCount === 0) {
                throw { status: 404, message: 'Раздела с таким id не существует' }
            }

            await sectionsModel.deleteSection(id)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new SectionsService()
