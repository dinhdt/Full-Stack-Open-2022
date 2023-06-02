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

test('delete blog post', async () => {
    const response = await api.get('/api/blogs')
    const initialLength = response.body.length
    const contents = response.body.filter(r => initialBlogs[0].title === r.title && initialBlogs[0].title === r.title )
    await api
        .delete(`/api/blogs/${contents[0].id}`)
        .expect(204)

    const responseAfter = await api.get('/api/blogs')
    const contentsAfter = responseAfter.body.filter(r => initialBlogs[0].title === r.title && initialBlogs[0].title === r.title )
    expect(responseAfter.body.length).toBe(initialLength - 1)
    expect(contentsAfter).not.toContainEqual(contents)
})


test('update blog post', async () => {
    const responseBefore = await api.get('/api/blogs')
    // get any entry from db and update fields with random values
    responseBefore.body[0].title    += 'test'
    responseBefore.body[0].url      += 'test.co.jp'
    responseBefore.body[0].author   += '911'
    responseBefore.body[0].likes    += 1337

    await api
        .put(`/api/blogs/${responseBefore.body[0].id}`)
        .send(responseBefore.body[0])

    const responseAfter = await api.get('/api/blogs')
    const editedBlog = responseAfter.body.filter(r => r.id === responseBefore.body[0].id)
    expect(editedBlog[0]).toEqual(responseBefore.body[0])
})


afterAll(async () => {
    await mongoose.connection.close()
})