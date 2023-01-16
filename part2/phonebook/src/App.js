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
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')
  
  const addContact = (event) => {
    event.preventDefault()
    const found = persons.find(element => areTheseObjectsEqual({name : newName}, element))

    if (found) {
      window.alert(`${newName} is already added to phonebook`);
    }
    else {
      setPersons(persons.concat({name : newName}))
      setNewName('')
    }

 
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