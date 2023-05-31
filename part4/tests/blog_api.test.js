const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')

const api = supertest(app)

test('blogs are returned as json and have a specific length', async () => {
    const response = await api.get('/api/blogs')

    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.status).toEqual(200)
    expect(response.body).toHaveLength(1)
})

afterAll(async () => {
    await mongoose.connection.close()
})