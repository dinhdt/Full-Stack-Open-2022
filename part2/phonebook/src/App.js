import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')
  
  const addContact = (event) => {
    event.preventDefault()
    setPersons(persons.concat({name : newName}))
    setNewName('')
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit" onClick={addContact}>add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <div>{persons.map(person => <div key={person.name}>{person.name}</div>)}</div>
    </div>
    
  )
}

export default App