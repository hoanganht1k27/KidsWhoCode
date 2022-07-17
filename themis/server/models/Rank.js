const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    problems: [String]
})

const Rank = mongoose.model('Rank', schema)

module.exports = Rank