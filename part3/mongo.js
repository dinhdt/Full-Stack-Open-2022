const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://lee90:${password}@cluster0.mh0vklm.mongodb.net/?retryWrites=true&w=majority`

const url = process.env.MONGODB_URI


mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
    // display all content
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
    return
}


const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

person.save().then( () => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
})

