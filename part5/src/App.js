import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect( () => {
    async function fetchBlogs() {
      setBlogs(await blogService.getAll())
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
    } catch (exception) {
      setNotification({isError:true, message:'Wrong credentials'})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    }
  }
  const handleBlogCreate = async (event) => {
      event.preventDefault()
      try {
         const newBlog = await blogService.create({
           author, title, url
        })      
        setTitle('')
        setAuthor('')
        setUrl('')
        setBlogs(await blogService.getAll())
        setNotification({isError:false, message:'Blog added'})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
      catch (exception) {

      }

    }
  
  if (user === null) {
    return (
      <div>
        <Notification messageObj={notification} />
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }


  return (
    <div>
      <Notification messageObj={notification} />
      <h2>blogs</h2>

      <div>
        <p>{`${user.name} logged in`}</p> <button onClick={() => {window.localStorage.removeItem('loggedBlogappUser'); setUser(null)}}>logout</button>
      </div>

      <div>
        <h2>create new</h2> 
        <form onSubmit={handleBlogCreate}>
          <div>
            title
              <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
              <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
              <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>

      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App