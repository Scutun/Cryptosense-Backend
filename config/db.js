const { Pool } = require('pg')
const { createClient } = require('redis')
const { MongoClient } = require('mongodb')
require('dotenv').config()

let pool
let redisClient
let mongoClient
let mongoDb

// PostgreSQL
const connectPostgres = async () => {
    pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
    })

    try {
        await pool.connect()
    } catch (error) {
        console.error('Ошибка подключения к PostgreSQL:', error.message)
        setTimeout(connectPostgres, 10000)
    }
}

// Redis
const connectRedis = async () => {
    redisClient = createClient({
        socket: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
        },
    })

    redisClient.on('error', (err) => {
        console.error('Redis error:', err.message)
    })

    try {
        await redisClient.connect()
    } catch (error) {
        console.error('Ошибка подключения к Redis:', error.message)
        setTimeout(connectRedis, 10000)
    }
}

// MongoDB
const connectMongoDB = async () => {
    mongoClient = new MongoClient(process.env.MONGO_URI)

    try {
        await mongoClient.connect()
        mongoDb = mongoClient.db(process.env.MONGO_DB_NAME)
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error.message)
        setTimeout(connectMongoDB, 10000)
    }
}

// Подключение всех баз
const connectDatabases = async () => {
    await Promise.all([connectPostgres(), connectRedis(), connectMongoDB()])
}

// Отключение всех баз
const disconnectDatabases = async () => {
    const withTimeout = (promise, name, ms = 5000) =>
        Promise.race([
            promise,
            new Promise((unused, reject) =>
                setTimeout(() => reject(new Error(`${name} timeout after ${ms}ms`)), ms),
            ),
        ])

    console.log('Закрытие соединений...')

    try {
        if (pool) {
            await withTimeout(pool.end(), 'PostgreSQL')
        }
    } catch (e) {
        console.warn('PostgreSQL завершение:', e.message)
    }

    try {
        if (redisClient) {
            await withTimeout(redisClient.quit(), 'Redis')
        }
    } catch (e) {
        console.warn('Redis завершение:', e.message)
    }

    try {
        if (mongoClient) {
            await withTimeout(mongoClient.close(), 'MongoDB')
        }
    } catch (e) {
        console.warn('MongoDB завершение:', e.message)
    }

    console.log('Все соединения закрыты')
}

// выключение сервера
const shutdown = async () => {
    await disconnectDatabases()
    console.log('Завершение работы')
    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

module.exports = {
    connectDatabases,
    disconnectDatabases,
    get pool() {
        if (!pool) {
            throw new Error('PostgreSQL pool не инициализирован')
        }
        return pool
    },
    get redisClient() {
        if (!redisClient) {
            throw new Error('Redis клиент не инициализирован')
        }
        return redisClient
    },
    get mongoDb() {
        if (!mongoDb) {
            throw new Error('mongoDb клиент не инициализирован')
        }
        return mongoDb
    },
}
