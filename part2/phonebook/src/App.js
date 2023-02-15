import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  

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
      window.alert(`${newName} is already added to phonebook`);
    }
    else {
      
      personService
      .create(newObj)
      .then(returnedObj => {
        setPersons(persons.concat(returnedObj))
        setNewName('')
        setNewNumber('')
      })

    }
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

  const namesToShow = persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

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

      <Persons persons={namesToShow}/>
    </div>
    
  )
}

export default App