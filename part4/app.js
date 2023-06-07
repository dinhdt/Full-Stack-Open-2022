const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('express-async-errors')
const cors = require('cors')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app