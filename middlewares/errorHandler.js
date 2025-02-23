function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Внутренняя ошибка сервера',
    })
}

module.exports = errorHandler
