const express = require('express')
//var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

//morgan.token('payload', function (req, res) { return JSON.stringify(req.body) })

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const Person = require('./models/person')

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people<br><br>${new Date()}`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
  })


app.post('/api/persons', (request, response) => {  
    // || persons.find(person => person.name === request.body.name)
    if(!request.body.name || !request.body.number ) {
        return response.status(400).json({ 
            error: 'no name or number' 
          })
    }
    const person = new Person ({
        name : request.body.name,
        number : request.body.number
    })
    person.save().then(savedEntry => {
        response.json(savedEntry)
    })
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

//   mongodb+srv://lee90:<password>@cluster0.mh0vklm.mongodb.net/?retryWrites=true&w=majority