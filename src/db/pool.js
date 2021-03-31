const { Pool } = require('pg')
const config = require('../utils/config')

const pool = new Pool({
    host: config.HOST,
    port: 5432,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.DATABASE_NAME,
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0,
})

module.exports = pool
