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
    },
    timeEachTest: {
        type: Number,
        min: 1000,
        max: 5000
    },
    scoreEachTest: {
        type: Number
    }
})

const Problem = mongoose.model('Problem', schema)

module.exports = Problem