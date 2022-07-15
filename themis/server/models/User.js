const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avaur: {
        type: String
    }
})

const User = mongoose.model('User', schema)

module.exports = User