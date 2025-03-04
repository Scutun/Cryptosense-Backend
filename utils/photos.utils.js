const db = require('../config/db').pool

async function getPhotos(req, res) {
    try {
        const result = await db.query(`SELECT * FROM photos`)
        res.json(result.rows)
    } catch (error) {
        throw error
    }
}

module.exports = { getPhotos }
