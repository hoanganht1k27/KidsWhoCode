
const express = require('express')
const route = express.Router()
const {addNewUser, getAllUsers, deleteUserById} = require('../controller/userController')
const {checkAuthenticatedUser, checkNotAuthenticatedUser} = require('../services/middleware')
const {getAllShowedTests, getAllProblems, getAllSubmittedProblems, getAllRankProblems, getProblem, getScore} = require('../services/problem')

const passport = require('../services/passportinit')
const Rank = require('../models/Rank')

route.get('/', checkAuthenticatedUser, async (req, res) => {
    let showedtests = await getAllShowedTests()
    let problems = await getAllProblems()
    let submittedProblems = await getAllSubmittedProblems(req.user._id)
    // console.log(submittedProblems)
    res.render('index', {fullname: req.user.fullname, submittedProblems: submittedProblems, isAdmin: req.user.isAdmin, showedtests: showedtests, problems: problems})
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

route.get('/allproblems', async (req, res) => {
    let problems = await getAllProblems()
    res.send(problems)
})

route.get('/allrankproblems', async (req, res) => {
    let rankProblems = await getAllRankProblems()

    if(!rankProblems) {
        res.send(null)
        return
    }

    let r = []
    for(let i = 0; i < rankProblems.length; i++) {
        let p = await getProblem(rankProblems[i])
        r.push(p)
    }

    res.send(r)
})

route.post('/add-to-rank', async (req, res) => {
    let problemId = req.body.problemId
    let r = await getAllRankProblems()
    if(!r) {
        let rp = new Rank({
            problems: [problemId]
        })
        await rp.save()
    } else {
        let rp = await Rank.findOne()
        if(!rp.problems.includes(problemId)) {
            rp.problems.push(problemId)
            await rp.save()
        }
    }
    req.flash('info', 'Add problem to rank successfully')
    res.redirect('/admin')
})

route.get('/score/:userId/:problemId', async (req, res) => {
    let {userId, problemId} = req.params
    res.send(getScore(userId, problemId))
})

route.get('/logout', checkAuthenticatedUser, (req, res) => {
    req.logOut((err) => {
        if(err) {
            req.flash('error', err.message)
        }
    })
    res.redirect('/login')
})

route.delete('/delete', checkAuthenticatedUser, async (req, res) => {
    let t = await deleteUserById(req.body.id)
    res.send(t)
})

route.use('/submit', checkAuthenticatedUser, require('./submitRouter'))

route.use('/profile', checkAuthenticatedUser, require('./profileRouter'))

route.use('/chat', checkAuthenticatedUser, require('./chatRouter'))

route.use('/admin', require('./adminRouter'))

route.get('/rank', checkAuthenticatedUser, async (req, res) => {
    // console.log(submittedProblems)
    res.render('rank', {fullname: req.user.fullname, isAdmin: req.user.isAdmin})
})

module.exports = route