const express = require('express')
const { json, urlencoded } = require('body-parser')
require('express-async-errors')

const app = express()
const middleware = require('./utils/middleware')
const { signin, protect } = require('./routes/auth')
const { start, stop } = require('./routes/api')

app.disable('x-powered-by')
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

// app.use('/', api)
app.post('/signin', signin)

app.use('/api', protect)
app.post('/api/start', start)
app.post('/api/stop', stop)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
