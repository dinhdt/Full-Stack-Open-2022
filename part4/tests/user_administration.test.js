const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')
const api = supertest(app)
const User = require('../models/user')
const { describe, beforeEach } = require('node:test')
const userTestHelper = require('./user_test_helper')


describe('test with initial list of users', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        userTestHelper.initialUsers.foreach(async user => {
            let userObject = new User(user)
            await userObject.save()
        })
    })

})


describe('test with empty user DB', () => {


    test('user creation api', async () => {
        await User.deleteMany({})
        const usersBefore = await userTestHelper.usersInDb()
        const response = await api
            .post('/api/users')
            .send(userTestHelper.initialUsers[0])
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const usersAfter = await userTestHelper.usersInDb()
        expect(response.body.username).toEqual(userTestHelper.initialUsers[0].username)
        expect(usersAfter.length).toBe(usersBefore.length + 1)
        const contents = usersAfter.map(user => user.username)
        expect(contents).toContainEqual(userTestHelper.initialUsers[0].username)
    })

    test('create invalid user', async () => {
        await User.deleteMany({})
        let wrongUsername = userTestHelper.initialUsers[0]
        let wrongPassword = userTestHelper.initialUsers[1]

        wrongUsername.username = '12'
        wrongPassword.password = '12'

        const responseUsername = await api
            .post('/api/users')
            .send(wrongUsername)
            .expect(400)
        expect(responseUsername.body.name).toEqual('ValidationError')
        const responsePassoword = await api
            .post('/api/users')
            .send(wrongPassword)
            .expect(400)
        logger.info(responseUsername.body)
        logger.info(responsePassoword.body)
        const usersAfter = await userTestHelper.usersInDb()
        expect(usersAfter.length).toBe(0)
        expect(responsePassoword.body.error).toBeDefined()
    })


})

afterAll(async () => {
    await mongoose.connection.close()
})