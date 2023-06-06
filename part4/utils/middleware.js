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

module.exports = { unknownEndpoint, tokenExtractor }