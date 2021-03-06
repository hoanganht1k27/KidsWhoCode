
const express = require('express')
const route = express.Router()

const multer = require('multer')
const path = require('path')

const fs = require('fs')

const {checkAdminAuthenticatedUser, addProblemToDB} = require('../services/middleware')
const {processInputForAdd, processInputForDelete, processInputForReset} = require('../services/admin')
const {addUsers, deleteUsers} = require('../controller/adminController')
const {getAllUsers} = require('../controller/userController')
const {updateProblemPath, getAllProblems, makeDir, getProblemInfo, deleteProblem, addSettingToProblem, getAllRankProblems} = require('../services/problem')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.env.UPLOAD_PROBLEM_DIR))
    },
    filename: function (req, file, cb) {
            cb(null, req.problemId + '_' + file.originalname)
    }
});

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        let p = path.join(process.env.UPLOAD_TEST_DIR, req.body.problemId)
        makeDir(p)
        cb(null, p)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage})
const uploadTest = multer({storage: storage2})

route.get('/', checkAdminAuthenticatedUser, async (req, res) => {
    let p = await getAllProblems()
    let rp = await getAllRankProblems()
    console.log(rp)
    let r = []
    if(rp) {
        for(let i = 0; i < rp.length; i++) {
            let p = await getProblem(rp[i])
            r.push(p)
        }
    }
    res.render('admin', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, problems: p, rankproblems: r})
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

route.post('/upload-problem', addProblemToDB, upload.single('problem'), async (req, res, next) => {
    updateProblemPath(req.problemId, req.file.filename, req.body.problemname, req.body.timeEachTest, req.body.scoreEachTest)
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
    
})

route.post('/upload-test', uploadTest.array('tests', 30), (req, res) => {
    req.flash('info', "Upload test successfully");
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