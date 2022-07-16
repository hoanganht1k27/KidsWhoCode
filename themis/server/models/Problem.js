const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    name: {
        type: String
    },
    uploaded_at: {
        type: Date
    },
    uploaded_at_nice: {
        type: String
    },
    path: {
        type: String
    }
})

const Problem = mongoose.model('Problem', schema)

module.exports = Problem