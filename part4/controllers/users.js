const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    const PASSWORD_MIN_LENGTH = 3
    if (password.length < PASSWORD_MIN_LENGTH) {
        return response.status(400).send({ error : 'Password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})


usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})


module.exports = usersRouter