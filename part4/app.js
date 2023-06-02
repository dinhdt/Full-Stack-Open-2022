const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('express-async-errors')
const cors = require('cors')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')


mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogRouter)


module.exports = app