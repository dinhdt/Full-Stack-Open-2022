import { useState } from 'react'


function areTheseObjectsEqual(first, second) {
  const al = Object.getOwnPropertyNames(first);
  const bl = Object.getOwnPropertyNames(second);

  // Check if the two list of keys are the same
  // length. If they are not, we know the objects
  // are not equal.
  if (al.length !== bl.length) return false;

  // Check that all keys from both objects match
  // are present on both objects.
  const hasAllKeys = al.every(value => !!bl.find(v => v === value));

  // If not all the keys match, we know the
  // objects are not equal.
  if (!hasAllKeys) return false;

  // We can now check that the value of each
  // key matches its corresponding key in the
  // other object.
  for (const key of al) if (first[key] !== second[key]) return false;

  // If the object hasn't return yet, at this
  // point we know that the objects are the
  // same
  return true;
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const addContact = (event) => {
    event.preventDefault()
    const newObj = {name : newName, number : newNumber}
    const found = persons.find(element => areTheseObjectsEqual(newObj, element))

    if (found) {
      window.alert(`${newName} is already added to phonebook`);
    }
    else {
      setPersons(persons.concat(newObj))
      setNewName('')
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
      <div>filter shown with <input value={filter} onChange={handleFilter} /></div>
      <h2>add a new</h2>
    <form>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNameNumber} /></div>
      <div><button type="submit" onClick={addContact}>add</button></div>
    </form>

      <h2>Numbers</h2>
      <div>{namesToShow.map(person => <div key={person.name}>{`${person.name} ${person.number}`}</div>)}</div>
    </div>
    
  )
}

export default App