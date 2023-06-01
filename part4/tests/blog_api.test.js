const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'anh dean',
        author: 'anh Dean',
        url: 'unknown.com',
        likes: 522,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
})

test('blogs are returned as json and have a specific length', async () => {
    const response = await api.get('/api/blogs')

    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.status).toEqual(200)
    expect(response.body).toHaveLength(1)
})

test('blogs posts id field exist', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('blogs posts are successfully stored', async () => {

    const newPost ={
        title: 'new',
        author: 'anh new',
        url: 'unknown.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => {
        return { title : r.title, author : r.author, url : r.url, likes : r.likes }
    })

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContainEqual(newPost)
})

test('blog post like property missing', async () => {

    const newPost ={
        title: 'new',
        author: 'anh new',
        url: 'unknown.com',
    }

    await api
        .post('/api/blogs')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    let filtered = response.body.filter(blog => blog.title === newPost.title)
    expect(filtered[0].likes).toEqual(0)

})

test('blog post title / author property missing', async () => {

    const newNoTitle ={
        url: 'unknown.com',
    }

    const newNoUrl={
        title: 'new',
        author: 'anh new',
    }

    await api
        .post('/api/blogs')
        .send(newNoTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(newNoUrl)
        .expect(400)
})


afterAll(async () => {
    await mongoose.connection.close()
})