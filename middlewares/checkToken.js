const jwt = require('jsonwebtoken')

function checkToken(req, res, next) {
    try {
        const authHeaders = req.headers.authorization
        const token = authHeaders && authHeaders.split(' ')[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        next()
    } catch (error) {
        res.status(403).json({ message: 'Недействительный токен' })
    }
}

module.exports = checkToken
