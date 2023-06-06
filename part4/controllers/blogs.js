const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
// const User = require('../models/user')
// const logger = require('../utils/logger')
// const jwt = require('jsonwebtoken')

// ...

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username : 1, name : 1, id : 1 })
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    if (!body.url || !body.title) {
        return response.status(400).send({ error: 'title or url missing' })
    }

    const blog = new Blog(body)
    if(!body.likes) {
        blog.likes = 0
    }
    blog.user = request.user._id

    const result = await blog.save()
    request.user.blogs = request.user.blogs.concat(result._id)
    await request.user.save()
    response.status(201).json(result)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {

    const blog = await Blog.findById(request.params.id)

    if ( request.user && blog && blog.user.toString() === request.user._id.toString() ) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(201).end()
    }
    else {
        return response.status(401).json({ error: 'no permission' })
    }
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        author : body.author,
        url : body.url,
        title : body.title,
        likes : body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog).end()
})

module.exports = blogRouter