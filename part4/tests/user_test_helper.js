const User = require('../models/user')

const initialUsers = [
    {
        username : 'anhDean',
        name: 'Dean',
        password: '1337'
    },

    {
        username : 'emDean',
        name: 'dean',
        password: 'leet'
    },

]


const usersInDb = async () => {
    const users = await User.find({})
    return users.map(note => note.toJSON())
}


module.exports = {
    initialUsers, usersInDb
}