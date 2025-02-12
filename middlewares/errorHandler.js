function errorHandler(err, req, res, next) {
    res.status(err.statusCode || 500).json({
        error: {
            code: err.statusCode || 500,
            message: err.message || 'Internal server error',
        },
    })
}

module.exports = errorHandler
