require('dotenv').config()
const { connectDatabases, disconnectDatabases } = require('./config/db')

const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const PORT = process.env.PORT || 3020
const cookieParser = require('cookie-parser')
const errorHandler = require('./middlewares/errorHandler')
const { exec } = require('child_process')
const cron = require('node-cron')

function restartAllContainers() {
    return new Promise((resolve, reject) => {
        exec('docker ps -q', (error, stdout, stderr) => {
            if (error) {
                console.error(`Ошибка при получении контейнеров: ${error.message}`)
                return reject(error)
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`)
                return reject(stderr)
            }

            const containerIds = stdout.trim().split('\n')
            if (containerIds.length > 0) {
                const restartCommand = `powershell -Command "docker restart ${containerIds.join(' ')}"`
                exec(restartCommand, (restartError, restartStdout, restartStderr) => {
                    if (restartError) {
                        console.error(
                            `Ошибка при перезапуске контейнеров: ${restartError.message}`,
                        )
                        return reject(restartError)
                    }
                    if (restartStderr) {
                        console.error(`stderr: ${restartStderr}`)
                        return reject(restartStderr)
                    }
                    console.log(`Контейнеры перезапущены: \n${restartStdout}`)
                    resolve(restartStdout)
                })
            } else {
                console.log('Нет запущенных контейнеров для перезапуска.')
                resolve('Нет контейнеров')
            }
        })
    })
}


async function startServer() {
    await connectDatabases()

    const userRoutes = require('./routes/users.routes')
    const courseRoutes = require('./routes/courses.routes')
    const reviewRoutes = require('./routes/reviews.routes')
    const sectionRoutes = require('./routes/sections.routes')
    const photosRoutes = require('./routes/photos.routes')
    const testsRoutes = require('./routes/tests.routes')
    const lessonsRoutes = require('./routes/lessons.routes')
    const additionsRoutes = require('./routes/additions.routes')
    const authorsRoutes = require('./routes/authors.routes')

    app.use(cookieParser())
    app.use(express.json())
    app.use(cors())

    const swaggerMain = yaml.load(fs.readFileSync('./docs/main.swagger.yaml', 'utf8'))

    app.use('/api/v1/swagger/docs', swaggerUi.serve, swaggerUi.setup(swaggerMain))

    app.use(
        '/api/v1/profiles/avatars/url/',
        express.static(path.join(__dirname, 'uploads/avatars')),
    )
    app.use('/api/v1/courses/photo/url/', express.static(path.join(__dirname, 'uploads/course')))

    app.use('/api', userRoutes)
    app.use('/api', courseRoutes)
    app.use('/api', reviewRoutes)
    app.use('/api', sectionRoutes)
    app.use('/api', testsRoutes)
    app.use('/api', photosRoutes)
    app.use('/api', lessonsRoutes)
    app.use('/api', additionsRoutes)
    app.use('/api', authorsRoutes)
    app.use(errorHandler)


    cron.schedule('08 3 * * *', async () => {
        console.log('[CRON] Запуск планового перезапуска всех контейнеров')

        try {
            // Отключаемся от всех баз данных
            await disconnectDatabases()

            // Перезапускаем контейнеры
            await restartAllContainers()

            // После перезапуска контейнеров переподключаемся к базам данных
            await connectDatabases()
            console.log('Переподключение после перезапуска контейнеров завершено.')
        } catch (error) {
            console.error('Ошибка в процессе перезапуска:', error)
        }
    })

    app.get('/server', (req, res) => {
        res.send('Server is running')
    })

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
        console.log(`Documentation is available on http://localhost:${PORT}/api/v1/swagger/docs`)
    })
    return app
}
startServer().catch((err) => {
    console.error('Ошибка запуска сервера:', err)
    process.exit(1)
})

module.exports = app //Необходимо для тестирования
