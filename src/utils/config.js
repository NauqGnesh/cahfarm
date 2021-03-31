require('dotenv').config()

const { PORT } = process.env
const { POSTGRES_PORT } = process.env
const { POSTGRES_USER } = process.env
const { POSTGRES_PASSWORD } = process.env
const { HOST } = process.env
const { DATABASE_NAME } = process.env
const { JWT_SECRET } = process.env
const { JWT_EXP } = process.env

module.exports = {
    PORT,
    POSTGRES_PASSWORD,
    POSTGRES_USER,
    POSTGRES_PORT,
    HOST,
    DATABASE_NAME,
    JWT_SECRET,
    JWT_EXP,
}
