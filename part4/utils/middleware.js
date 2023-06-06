const User = require('../models/user')
const jwt = require('jsonwebtoken')


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {

    const getTokenFrom = request => {
        const authorization = request.get('authorization')
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '')
        }
        return null
    }

    request.token = getTokenFrom(request)
    next()
}

const userExtractor = async (request, response, next) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    request.user = await User.findById(decodedToken.id)

    next()
}

module.exports = { unknownEndpoint, tokenExtractor, userExtractor }