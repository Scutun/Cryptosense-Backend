const path = require('path')
const fs = require('fs')
const db = require('../config/db').pool

const courseUploadsPath = path.join(__dirname, '..', 'uploads', 'course')
const defaultImagePath = path.join(courseUploadsPath, 'DefaultCoursePhoto.jpg')

async function getPhotos(req, res) {
    try {
        const result = await db.query(`SELECT * FROM photos`)
        res.json(result.rows)
    } catch (error) {
        throw error
    }
}

const serveCoursePhoto = (req, res, next) => {
    const requestedFile = path.join(courseUploadsPath, req.path)

    fs.access(requestedFile, fs.constants.F_OK, (err) => {
        if (err) {
            return res.sendFile(defaultImagePath)
        }

        next()
    })
}

module.exports = { getPhotos, serveCoursePhoto, courseUploadsPath }
