const { Pool } = require('pg')
const { createClient } = require('redis')
require('dotenv').config()

// Подключение к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
})

// Подключение к Redis
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
})

redisClient.connect().catch(console.error)

// Закрытие подключений при завершении работы
const shutdown = async () => {
    console.log('Закрытие соединений...')
    await pool.end()
    await redisClient.quit()
    console.log('Все соединения закрыты. Завершение работы.')
    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

module.exports = { pool, redisClient }
