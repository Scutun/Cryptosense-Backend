function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        error: {
            code: err.status || 500,
            message: err.message || 'Internal server error',
        },
    })
}

module.exports = errorHandler
