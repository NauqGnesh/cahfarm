const config = require('../utils/config')

const {
    queryUserByEmail,
    queryUserById,
    checkPassword,
} = require('../db/user')
const jwt = require('jsonwebtoken')
const { isValidEmail, validatePassword } = require('../utils/validation')

const newToken = (user) => {
    return jwt.sign({ id: user.id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXP,
    })
}

const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, payload) => {
            if (err) return reject(err)
            resolve(payload)
        })
    })

const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }

    if (!isValidEmail(req.body.email)) {
        return res.status(400).send({ message: 'Invalid email' })
    }

    const invalid = { message: 'Invalid passoword ' }

    if (!validatePassword(req.body.password)) {
        return res.status(400).send(invalid)
    }

    try {
        const user = await queryUserByEmail(req.body.email)
        console.log(user)
        if (!user) {
            return res.status(401).send(invalid)
        }

        const match = await checkPassword(req.body.password, user.password)

        if (!match) {
            return res.status(401).send(invalid)
        }

        const token = newToken(user)
        return res.status(201).send({ token })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}

const protect = async (req, res, next) => {
    const bearer = req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).end()
    }

    const token = bearer.split('Bearer ')[1].trim()
    let payload
    try {
        payload = await verifyToken(token)
    } catch (e) {
        return res.status(401).end()
    }
    const user = await queryUserById(payload.id)
    if (!user) {
        return res.status(401).end()
    }

    req.user = user
    next()
}

module.exports = { signin, protect }
