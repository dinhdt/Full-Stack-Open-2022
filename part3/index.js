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
    else if (error.name === 'ValidationError') {
        return response.status(400).json(error)
    }
    next(error)
}


//morgan.token('payload', function (req, res) { return JSON.stringify(req.body) })

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))



const Person = require('./models/person')

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`Phonebook has info for ${persons.length} people<br><br>${new Date()}`)
    })
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


app.post('/api/persons', (request, response, next) => {

    const person = new Person ({
        name : request.body.name,
        number : request.body.number
    })
    person.save()
        .then(savedEntry => {
            response.json(savedEntry)
        })
        .catch(error => {
            next(error)
        })
})



app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then( () => {
            response.status(204).end()
        })
        .catchcatch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name : body.name,
        number : body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        }).
        catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)
