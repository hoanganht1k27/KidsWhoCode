
const express = require('express')
const route = express.Router()

const multer = require('multer')
const path = require('path')

const fs = require('fs')

const {checkAdminAuthenticatedUser, addProblemToDB} = require('../services/middleware')
const {processInputForAdd, processInputForDelete, processInputForReset} = require('../services/admin')
const {addUsers, deleteUsers} = require('../controller/adminController')
const {addContest, getAllContest} = require('../controller/contestController')
const {getAllUsers} = require('../controller/userController')
const {updateProblemPath, getAllProblems, makeDir, getProblemInfo, deleteProblem, addSettingToProblem, getAllRankProblems} = require('../services/problem')

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
            console.log(file)
            if(file.fieldname == 'problem') {
                req.filename = req.problemId + '_' + file.originalname
                cb(null, req.problemId + '_' + file.originalname)
            }
            if(file.fieldname == 'solution') {
                req.solution = 1
                cb(null, "sol.cpp")
            }
            if(file.fieldname == 'tests') {
                req.tests = 1
                cb(null, file.originalname)
            }
            return cb(new Error("Cannot upload file"))
    }
})

const uploadAll = multer({storage: storage}).fields([
    {name: 'problem', maxCount: 1},
    {name: 'solution', maxCount: 1},
    {name: 'tests', maxCount: 200}
]);

route.get('/', checkAdminAuthenticatedUser, async (req, res) => {
    let contests = await getAllContest()
    res.render('admin', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, contests: contests})
})

route.post('/upload-contest', checkAdminAuthenticatedUser, async (req, res) => {
    let { contestname, contestpassword, start } = req.body

    addContest(contestname, contestpassword, start)
        .then(() => {
            req.flash('info', 'Add contest successfully')
            res.redirect('/admin')
        })
        .catch((e) => {
            req.flash('error', e.message)
            res.redirect('/admin')
        })
    
})

route.use('/contest', checkAdminAuthenticatedUser, require('./contestRouter'))

route.post('/upload-problem', checkAdminAuthenticatedUser, addProblemToDB, 
    (req, res, next) => {
        uploadAll(req, res, (err) => {
            if(err) {
                req.flash('error', 'Upload problem failed')
                res.redirect('/admin')
                return
            } else {
                return next()
            }
        })
    },
    (req, res) => {
        if(req.filename && req.solution && req.tests)
        updateProblemPath(req.problemId, req.filename, req.body.problemname, req.body.timeEachTest, req.body.scoreEachTest, req.body.contestid)
        .then(() => {
            addSettingToProblem(req.problemId, req.body.timeEachTest, req.body.scoreEachTest)
            req.flash('info', 'Upload problem successfully')
            res.redirect('/admin')
        })
        .catch((e) => {
            console.log(e)
            req.flash('error', 'Upload problem failed')
            res.redirect('/admin')
        })
        else {
            req.flash('error', 'Upload problem failed')
            res.redirect('/admin')
        }
    })

route.get('/allusers', checkAdminAuthenticatedUser, async (req, res) => {
    let r = await getAllUsers()
    res.send(r)
})

route.post('/add', checkAdminAuthenticatedUser, async (req, res) => {
    let arr = processInputForAdd(req.body.adduser)

    let r = await addUsers(arr)

    let errorMessage = ""

    for(let i = 0; i < r.length; i++) {
        if(r[i].error) {
            errorMessage += r[i].username + ', '
        }
    }

    if(errorMessage != "") {
        req.flash('error', 'Cannot add users: ' + errorMessage)
        res.redirect('/admin')
    } else {
        req.flash('info', "All users added")
        res.redirect('/admin')
    }
})

route.post('/delete', checkAdminAuthenticatedUser, async (req, res) => {
    let arr = processInputForDelete(req.body.deleteuser)

    let r = await deleteUsers(arr)

    req.flash('info', 'Users deleted')
    res.redirect('/admin')
})

route.post('/reset', checkAdminAuthenticatedUser, async (req, res) => {
    let arr = processInputForReset(req.body.resetuser)

    let r = await resetUsers(arr)

    req.flash('info', 'Users reset successfully')
    res.redirect('/admin')
})

route.get('/problem/:id', checkAdminAuthenticatedUser, async (req, res) => {
    let problemId = req.params.id
    let r = await getProblemInfo(problemId)
    res.json(r)
})

route.post('/delete-problem', checkAdminAuthenticatedUser, async (req, res) => {
    deleteProblem(req.body.problemId)
        .then(() => {
            req.flash('info', "Delete problem successfully")
            res.redirect('/admin')
        })
        .catch(() => {
            req.flash('error', "Delete problem failed")
            res.redirect('/admin')
        })
    
})

route.post('/show-test', checkAdminAuthenticatedUser, (req, res) => {
    let {problemId, testfilename} = req.body
    let oldPath = path.join(process.env.UPLOAD_TEST_DIR, problemId, testfilename)
    let newPath = path.join(process.env.SHOW_TEST_DIR, problemId)
    makeDir(newPath)
    newPath = path.join(newPath, testfilename)

    fs.copyFile(oldPath, newPath, (err) => {
        if(err) {
            req.flash('error', 'Cannot show this test, please check again')
        }
        else
        req.flash('info', 'Show test successfully')

        res.redirect('/admin')
    })
})

route.post('/delete-test', checkAdminAuthenticatedUser, (req, res) => {
    let {problemId, testfilename} = req.body
    let oldPath = path.join(process.env.UPLOAD_TEST_DIR, problemId, testfilename)

    try {
        fs.unlinkSync(oldPath)
        req.flash('info', 'Delete test successfully')
        res.redirect('/admin')
    } catch {
        req.flash('error', 'Delete test failed')
        res.redirect('/admin')
    }
})

module.exports = route