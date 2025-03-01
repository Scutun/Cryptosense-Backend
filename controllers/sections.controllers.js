const sectionsService = require('../services/sections.services')

class SectionsController {
    async createSection(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)

            const section = await sectionsService.createSection(req.body, userId)
            res.json(section)
        } catch (error) {
            next(error)
        }
    }

    async getSections(req, res, next) {
        try {
            const sections = await sectionsService.getSections(req.params.id)
            res.json(sections)
        } catch (error) {
            next(error)
        }
    }

    async updateSection(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)

            const section = await sectionsService.updateSection(req.body, userId)
            res.json(section)
        } catch (error) {
            next(error)
        }
    }

    async deleteSection(req, res, next) {
        try {
            const userId = tokenUtils.getIdFromToken(req)

            await sectionsService.deleteSection(req.params.id, userId)
            res.status(200).json({ message: 'Раздел успешно удален' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new SectionsController()
