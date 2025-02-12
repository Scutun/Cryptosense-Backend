require('dotenv').config()
require('./config/db')

const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const yaml = require('js-yaml')
const PORT = process.env.PORT || 3020

app.use(express.json())
app.use(cors())

const swaggerDocument = yaml.load(fs.readFileSync('./docs/swagger_example.yaml', 'utf8'))

app.use('/api/swagger/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/server', (req, res) => {
    res.send('Server is running')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Documentation is available on http://localhost:${PORT}/api/swagger/docs`)
})
