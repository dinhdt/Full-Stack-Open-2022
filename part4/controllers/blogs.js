const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    if (!blog.url || !blog.title) {
        return response.status(400).send({ error: 'title or url missing' })
    }

    if(!blog.likes) {
        blog.likes = 0
    }
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = blogRouter