const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avaurl: {
        type: String
    },
    isAdmin: {
        type: Boolean
    }
})

const User = mongoose.model('User', schema)

module.exports = User