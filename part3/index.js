const express = require('express')
//var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => { 
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } 
    
    next(error)
}


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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        }).
        catch(error => {
            next(error)
        })
  })


  app.post('/api/persons', (request, response) => {  

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



app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
                response.status(204).end()
        }).
        catch(error => next(error))
  })


app.put('/api/persons/:id', (request, response) => {  
    const body = request.body
    const person = {
        name : body.name,
        number : body.number 
    }

    Person.findByIdAndUpdate(request.params.id, person, {new : true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        }).
        catch(error => next(error))
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

//   mongodb+srv://lee90:<password>@cluster0.mh0vklm.mongodb.net/?retryWrites=true&w=majority

app.use(errorHandler)
