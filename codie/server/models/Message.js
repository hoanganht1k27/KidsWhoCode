const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avaurl: {
        type: String,
        required: true
    },
    sent_at: {
        type: Date,
        required: true
    }
})

const Message = mongoose.model('Message', schema)

module.exports = Message