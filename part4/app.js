const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('express-async-errors')
const cors = require('cors')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json(error)
    }
    else if (error.name ===  'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

module.exports = app