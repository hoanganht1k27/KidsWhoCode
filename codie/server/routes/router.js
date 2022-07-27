
const express = require('express')
const route = express.Router()
const {getAllUsers, deleteUserById} = require('../controller/userController')
const {checkAuthenticatedUser, checkNotAuthenticatedUser, checkContest} = require('../services/middleware')
const {getAllProblems, getAllSubmittedProblems, getScore} = require('../services/problem')

const passport = require('../services/passportinit')
const { getAllContest, getContestById, getAllProblemsOfContest } = require('../controller/contestController')
const { comparePassword } = require('../services/password')
const { getProblemById } = require('../controller/problemController')
const path = require('path')

route.get('/', checkAuthenticatedUser, async (req, res) => {
    let contests = await getAllContest()
    res.render('index', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, contests: contests, showContest: 0})
})

route.get('/contests/:id', checkAuthenticatedUser, async (req, res) => {
    let contestId = req.params['id']
    let contest = await getContestById(contestId)
    if(contest.start == false) {
        req.flash('error', 'Contest is not started, cannot join in')
        return res.redirect('/')
    }
    if(!req.session.contestId || req.session.contestId != contestId) {
        res.render('index', {fullname: req.user.fullname, contest: contest, isAdmin: req.user.isAdmin, showContest: 1})
    } else {
        let problems = await getAllProblemsOfContest(contestId)
        let sp = await getAllSubmittedProblems(req.user._id)
        let submittedProblems = []
        for(let i = 0; i < sp.length; i++) {
            let kt = 0;
            for(let j = 0; j < problems.length; j++) {
                if(problems[j]._id == sp[i].problemId) {
                    kt = 1;
                    break;
                }
            }
            if(kt) {
                submittedProblems.push(sp[i])
            }
        }
        res.render('index', {fullname: req.user.fullname, submittedProblems: submittedProblems,  contest: contest, isAdmin: req.user.isAdmin, showContest: 2, problems: problems})
    }
})

route.post('/contests/:id', checkAuthenticatedUser, async (req, res) => {
    let contestId = req.params['id']
    let {contestpassword} = req.body
    let contest = await getContestById(contestId)
    if(contest.start == false) {
        req.flash('error', 'Contest is not started, cannot join in')
        return res.redirect('/')
    }
    if(contest) {
        let t = await comparePassword(contestpassword, contest.password)
        if(t) {
            req.session.contestId = contestId
            res.redirect('/contests/' + contestId)
            return
        } else {
            req.flash('error', 'Password logging into contest is not correct, please try again')
            res.redirect('/')
        }
    } else {
        req.flash('error', 'Error logging into contest, please try again')
        res.redirect('/')
    }
})

route.get('/contests/:id/problem/:problemid', checkAuthenticatedUser, checkContest, async (req, res) => {
    let contestId = req.params['id']
    let problemId = req.params['problemid']
    let p = await getProblemById(problemId)
    if(!p) {
        req.flash('error', 'Problem not found')
        return res.redirect('/contests/' + contestId)
    }
    if(p.problem.contestId != contestId) {
        req.flash('error', 'Cannot see the problem, it does not belong to this contest')
        return res.redirect('/contests/' + contestId)
    }

    let filename = path.join(process.env.BASE_DIR, process.env.UPLOAD_PROBLEM_DIR, p.problem.path)
    res.sendFile(filename, (err) => {
        if(err) {
            req.flash('error', 'Some error has occured')
            res.redirect('/contests/' + contestId)
        }
    })
})

route.get('/contests/:id/rank', checkAuthenticatedUser, checkContest, async (req, res) => {
    let contestId = req.params['id']
    let contest = await getContestById(contestId)
    // console.log(contest)
    let problems = await getAllProblemsOfContest(contestId)
    let u = await getAllUsers()
    let users = []
    for(let i = 0; i < u.length; i++) {
        let kt = 0
        for(let j = 0; j < problems.length; j++) {
            let p = problems[j]
            let s = getScore(u[i]._id.toString(), problems[j]._id.toString())
            if(s) {
                kt = 1
                break
            }
        }
        if(kt) {
            users.push(u[i])
        }
    }
    let rank = []
    let sum = []
    for(let i = 0; i < users.length; i++) {
        rank[users[i]._id] = []
        sum[users[i]._id] = 0
        for(let j = 0; j < problems.length; j++) {
            let score = getScore(users[i]._id.toString(), problems[j]._id.toString())
            rank[users[i]._id][problems[j]._id] = score
            if(score) {
                sum[users[i]._id] += score.score
            }
        }
    }   


    let sortedSum = []

    for(let id in sum) {
        sortedSum.push([id, sum[id]])
    }

    sortedSum.sort(function(a, b) {
        return b[1] - a[1]
    })

    let username = []
    for(let i = 0; i < users.length; i++) {
        username[users[i]._id] = users[i].fullname
    }

    res.render('rank', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, contest: contest, problems: problems, users: users, rank: rank, sortedSum: sortedSum, username: username, showContest: 2})
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

module.exports = route