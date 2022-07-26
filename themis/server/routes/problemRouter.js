const express = require('express')
const { getProblemById } = require('../controller/problemController')
const route = express.Router()
const path = require('path')
const multer = require('multer')
const fs = require('fs')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname == 'problem') {
            cb(null, path.join(process.env.BASE_DIR, process.env.UPLOAD_PROBLEM_DIR))
        }
        else {
            // console.log(req.problemId)
            let p = path.join(process.env.BASE_DIR, process.env.UPLOAD_TEST_DIR, req.problemId)
            makeDir(p)
            cb(null, p)
        }
        
    },
    filename: function (req, file, cb) {
            if(file.fieldname == 'problem') {
                req.filename = req.problemId + '_' + file.originalname
                cb(null, req.problemId + '_' + file.originalname)
            } else
            if(file.fieldname == 'solution') {
                req.solution = 1
                cb(null, "sol.cpp")
            } else
            if(file.fieldname == 'tests') {
                req.tests = 1
                cb(null, file.originalname)
            } else
            return cb(new Error("Cannot upload file"))
    }
})

const uploadAll = multer({storage: storage}).fields([
    {name: 'problem', maxCount: 1},
    {name: 'solution', maxCount: 1},
    {name: 'tests', maxCount: 200}
]);


route.get('/:id', async (req, res) => {
    let problemId = req.params['id']
    let {problem, tests} = await getProblemById(problemId)
    res.render('problem', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, problem: problem, tests: tests, showContest: 0})
})

route.get('/:id/tests/:test', (req, res) => {
    let problemId = req.params['id']
    let test = req.params['test']
    let p = path.join(process.env.BASE_DIR, process.env.UPLOAD_TEST_DIR, problemId, test)
    res.sendFile(p, (err) => {
        if(err) {
            res.send("Test file does not exist")
        }
    })
})

route.get('/:id/problem/:problem', (req, res) => {
    let problemId = req.params['id']
    let problem = req.params['problem']
    let p = path.join(process.env.BASE_DIR, process.env.UPLOAD_PROBLEM_DIR, problem)
    res.sendFile(p, (err) => {
        if(err) {
            res.send("Problem file does not exist")
        }
    })
})

route.get('/:id/solution/:problem', (req, res) => {
    let problemId = req.params['id']
    let problem = req.params['problem']
    let p = path.join(process.env.BASE_DIR, process.env.UPLOAD_TEST_DIR, problemId, problem)
    res.sendFile(p, (err) => {
        if(err) {
            res.send("Solution file does not exist")
        }
    })
})

route.post('/update-problem', (req, res, next) => {
    uploadAll(req, res, (err) => {
        if(err) {
            req.flash('error', 'Update problem failed')
            res.redirect('/admin')
            return
        } else {
            let u = updateProblem(req.body.problemid, req.body.timeEachTest, req.body.scoreEachTest, req.filename)
            if(u) {
                u.then(() => {
                    req.flash('info', 'Update problem successfully')
                    res.redirect('/admin')
                    return
                }).catch((err) => {
                    req.flash('error', err.message)
                    res.redirect('/admin')
                    return
                })
            }
        }
    })
})

route.delete('/:id/tests/:test', (req, res) => {
    let problemId = req.params['id']
    let test = req.params['test']
    let p = path.join(process.env.BASE_DIR, process.env.UPLOAD_TEST_DIR, problemId, test)
    let t = fs.unlinkSync(p)
    res.send(t)
})

module.exports = route
