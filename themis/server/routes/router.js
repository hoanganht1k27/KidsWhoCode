
const express = require('express')
const route = express.Router()
const {addNewUser, getAllUsers} = require('../controller/userController')
const {checkAuthenticatedUser, checkNotAuthenticatedUser} = require('../services/middleware')

route.get('/', checkAuthenticatedUser, (req, res) => {
    res.render('index', {fullname: req.user.fullname})
})

route.get('/login', checkNotAuthenticatedUser, (req, res) => {
    res.render('login')
})

route.post('/register', checkNotAuthenticatedUser, async (req, res) => {
    addNewUser(req.body);
    // res.redirect('/login')
    res.send("fuck")
})

route.get('/allusers', async (req, res) => {
    let users = await getAllUsers()
    res.send(users)
})

route.get('/logout', checkAuthenticatedUser, (req, res) => {
    req.logOut()
    res.redirect('/login')
})

module.exports = route