const express = require('express')
const { checkAuthenticatedUser } = require('../services/middleware')
const { addMessage, getAllMessages } = require('../controller/chatController')
const route = express.Router()

route.get('/', async (req, res) => {
    let messages = await getAllMessages()
    res.render('chat', {messages: messages, fullname: req.user.fullname, isAdmin: req.user.isAdmin, avaurl: req.user.avaurl, userid: req.user._id, username: req.user.username})
})

route.post('/add-message', (req, res) => {
    addMessage(req.body)
        .then((data) => {
            res.status(200).send({
                data: data
            })
        })
        .catch((err) => {
            res.status(500).send({
                error: err.message
            })
        })
})

route.get('/all-messages', async (req, res) => {
    


})

module.exports = route