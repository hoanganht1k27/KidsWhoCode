
const express = require('express')
const route = express.Router()
const {addNewUser, getAllUsers, deleteUserById} = require('../controller/userController')
const {checkAuthenticatedUser, checkNotAuthenticatedUser, checkContest} = require('../services/middleware')
const {getAllShowedTests, getAllProblems, getAllSubmittedProblems, getAllRankProblems, getProblem, getScore} = require('../services/problem')

const passport = require('../services/passportinit')
const Rank = require('../models/Rank')
const { getAllContest, getContestById, getAllProblemsOfContest } = require('../controller/contestController')
const { comparePassword } = require('../services/password')
const { getProblemById } = require('../controller/problemController')
const path = require('path')

route.get('/', checkAuthenticatedUser, async (req, res) => {
    let contests = await getAllContest()
    // console.log(submittedProblems)
    res.render('index', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, contests: contests, showContest: 0})
})

route.get('/contests/:id', checkAuthenticatedUser, async (req, res) => {
    let contestId = req.params['id']
    let contest = await getContestById(contestId)
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
                // console.log(s, u[i]._id, problems[j]._id)
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
        return a[1] - b[1]
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

route.get('/allrankproblems', async (req, res) => {
    let rankProblems = await getAllRankProblems()

    if(!rankProblems) {
        res.send(null)
        return
    }

    let r = []
    for(let i = 0; i < rankProblems.length; i++) {
        let p = await getProblem(rankProblems[i])
        if(p)
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