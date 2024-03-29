import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotifcation] = useState(null)
  

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  
  const addContact = (event) => {
    event.preventDefault()
    const newObj = {name : newName, number : newNumber}
    const found = persons.find(element => newObj.name === element.name)

    if (found) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(found.id, newObj)
        .then(obj => {
          setPersons(persons.map(p => p.id !== obj.id ? p : obj))
        })
        .catch(err => {
          setNotifcation({message: err.response.data.message, isError : true})

          setTimeout(() => {
            setNotifcation(null)
          }, 5000)

          //setPersons(persons.filter(p => p.id !== found.id))

        })
      }
    }
    else {
      
      personService
      .create(newObj)
      .then(returnedObj => {
        setPersons(persons.concat(returnedObj))
        setNotifcation({message : `Added ${returnedObj.name}`, isError : false})

        setTimeout(() => {
          setNotifcation(null)
        }, 2000)

      })
      .catch(error => {
        setNotifcation({message: error.response.data.message, isError : true})

        setTimeout(() => {
          setNotifcation(null)
        }, 5000)
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNameNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deleteEntry(person.id)
      .then(() => {        
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
  }
  const namesToShow = persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messageObj={notification} />
      <Filter filter_str={filter} handler={handleFilter} />

      <h3>add a new</h3>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNameNumber={handleNameNumber}
        addContact={addContact}
      />

      <h3>Numbers</h3>

      <Persons persons={namesToShow} deleteHandler={handleDelete} />
    </div>
    
  )
}

export default App