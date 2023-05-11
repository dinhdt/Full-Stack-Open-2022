import ReactDOM from 'react-dom'
import App from './App'

 const http = require('express')

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end('Hello World')
// })

// const PORT = 3002
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)