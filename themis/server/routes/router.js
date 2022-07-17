
const express = require('express')
const route = express.Router()
const {addNewUser, getAllUsers, deleteUserById} = require('../controller/userController')
const {checkAuthenticatedUser, checkNotAuthenticatedUser} = require('../services/middleware')
const {getAllShowedTests, getAllProblems} = require('../services/problem')

const passport = require('../services/passportinit')

route.get('/', checkAuthenticatedUser, async (req, res) => {
    let showedtests = await getAllShowedTests()
    let problems = await getAllProblems()
    res.render('index', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, showedtests: showedtests, problems: problems})
})

route.get('/login', checkNotAuthenticatedUser, (req, res) => {
    res.render('login')
})

route.post('/login', checkNotAuthenticatedUser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

route.get('/allusers', async (req, res) => {
    let users = await getAllUsers()
    res.send(users)
})

route.get('/logout', checkAuthenticatedUser, (req, res) => {
    req.logOut((err) => {
        if(err) {
            req.flash('error', err.message)
        }
    })
    res.redirect('/login')
})

route.delete('/delete', async (req, res) => {
    let t = await deleteUserById(req.body.id)
    res.send(t)
})

route.use('/profile', checkAuthenticatedUser, require('./profileRouter'))

route.use('/chat', checkAuthenticatedUser, require('./chatRouter'))

route.use('/admin', require('./adminRouter'))

module.exports = route