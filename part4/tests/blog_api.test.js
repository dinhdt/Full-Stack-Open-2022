const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const logger = require('../utils/logger')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
// const userTestHelper = require('./user_test_helper')

const blogUser = {
    username : 'Mr Test',
    password : 'hello123',
    name : 'Thomas Test'
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await api.post('/api/users').send(blogUser)

    const userinfo = await api.post('/api/login').send(blogUser).expect(200)

    const newPost ={
        title: 'new',
        author: 'anh new',
        url: 'unknown.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userinfo.body.token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
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
    // login as user
    const userinfo = await api.post('/api/login').send(blogUser).expect(200)
    const responseBefore = await api.get('/api/blogs')

    const newPost ={
        title: 'new new new',
        author: 'anh new',
        url: 'unknown.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        // .set('Authorization', `Bearer ${userinfo.body.token}`)
        .send(newPost)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userinfo.body.token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => {
        return { title : r.title, author : r.author, url : r.url, likes : r.likes }
    })

    expect(response.body).toHaveLength(responseBefore.body.length + 1)
    expect(contents).toContainEqual(newPost)
})

test('blogs posts fail without token', async () => {
    const newPost ={
        title: 'new',
        author: 'anh new',
        url: 'unknown.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newPost)
        .expect(401)
})

test('blog post like property missing', async () => {
    const userinfo = await api.post('/api/login').send(blogUser).expect(200)

    const newPost ={
        title: 'new nw neeeeeeew',
        author: 'anh new',
        url: 'unknown.com',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userinfo.body.token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    let filtered = response.body.filter(blog => blog.title === newPost.title)
    expect(filtered[0].likes).toEqual(0)

})

test('blog post title / author property missing', async () => {
    const userinfo = await api.post('/api/login').send(blogUser).expect(200)

    const newNoTitle ={
        url: 'unknown.com',
    }

    const newNoUrl={
        title: 'new',
        author: 'anh new',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userinfo.body.token}`)
        .send(newNoTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userinfo.body.token}`)
        .send(newNoUrl)
        .expect(400)
})


test('delete blog post', async () => {


    const newPost ={
        title: 'new new',
        author: 'anh new',
        url: 'unknown.com',
    }
    const userinfo = await api.post('/api/login').send(blogUser).expect(200)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userinfo.body.token}`)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const response = await api.get('/api/blogs')
    const initialLength = response.body.length
    const contents = response.body.filter(r => newPost.title === r.title && newPost.title === r.title )

    await api
        .delete(`/api/blogs/${contents[0].id}`)
        .expect(401)

    await api
        .delete(`/api/blogs/${contents[0].id}`)
        .set('Authorization', `Bearer ${userinfo.body.token}`)
        .expect(201)

    const responseAfter = await api.get('/api/blogs')
    const contentsAfter = responseAfter.body.filter(r => newPost.title === r.title && newPost.title === r.title )
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