require('dotenv').config()
require('./config/db')

const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const yaml = require('js-yaml')
const PORT = process.env.PORT || 3020
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/users.routes')
const reviewRoutes = require('./routes/reviews.routes')

app.use(cookieParser())
app.use(express.json())
app.use(cors())

const swaggerExample = yaml.load(fs.readFileSync('./docs/swagger_example.yaml', 'utf8'))
const swaggerUsers = yaml.load(fs.readFileSync('./docs/swagger_users.yaml', 'utf8'))
const swaggerReviews = yaml.load(fs.readFileSync('./docs/swagger_reviews.yaml', 'utf8'))

const mergedSwagger = {
    ...swaggerExample,
    tags: [
        { name: 'Users', description: 'Операции с пользователями' },
        { name: 'Reviews', description: 'Операции с отзывами' },
    ],
    paths: {
        ...Object.fromEntries(
            Object.entries(swaggerUsers.paths).map(([path, methods]) => [
                path,
                Object.fromEntries(
                    Object.entries(methods).map(([method, details]) => [
                        method,
                        { ...details, tags: ['Users'] },
                    ]),
                ),
            ]),
        ),

        ...Object.fromEntries(
            Object.entries(swaggerReviews.paths).map(([path, methods]) => [
                path,
                Object.fromEntries(
                    Object.entries(methods).map(([method, details]) => [
                        method,
                        { ...details, tags: ['Reviews'] },
                    ]),
                ),
            ]),
        ),
    },
    components: {
        ...swaggerExample.components,
        schemas: {
            ...swaggerExample.components?.schemas,
            ...swaggerUsers.components?.schemas,
            ...swaggerReviews.components?.schemas,
        },
        securitySchemes: {
            ...swaggerExample.components?.securitySchemes,
            ...swaggerUsers.components?.securitySchemes,
            ...swaggerReviews.components?.securitySchemes,
        },
    },
}

app.use('/api/swagger/docs', swaggerUi.serve, swaggerUi.setup(mergedSwagger))

app.use('/api', userRoutes)
app.use('/api', reviewRoutes)

app.get('/server', (req, res) => {
    res.send('Server is running')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Documentation is available on http://localhost:${PORT}/api/swagger/docs`)
})
