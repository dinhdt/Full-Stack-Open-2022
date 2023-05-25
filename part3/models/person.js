const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type : String,
        validate: {
            validator : (v) => {
                return /\d{2,3}-\d+/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers`
        },
        required: [true, 'User phone number required'],
        minLength: [8, 'phone numebr minimum length not reached']
    }
  })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
