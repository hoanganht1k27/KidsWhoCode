const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date
    },
    password: {
        type: String,
        required: true
    },
    start: {
        type: Boolean,
        required: true
    }
})

const Contest = mongoose.model('Contest', schema)

module.exports = Contest