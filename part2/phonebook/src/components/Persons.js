const Persons = (props) => {
    return(
        <div>
            {props.persons.map(person => <div key={person.id}> {`${person.name} ${person.number}`} <button onClick={func => props.deleteHandler(person)}>delete</button></div>)}
        </div>
    )
}


export default Persons