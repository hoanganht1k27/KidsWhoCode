
const express = require('express')
const route = express.Router()
const multer = require('multer')
const path = require('path')
const { getExtensionOfFile } = require('../services/problem')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.env.SUBMIT_DIR))
    },
    filename: function (req, file, cb) {
            let problemId = req.body.problemId
            let userId = req.user._id
            let extension = getExtensionOfFile(file.originalname)
            console.log(problemId)
            cb(null, Date.now() + '_' + problemId + '_' + userId + '.' + extension)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        let extension = getExtensionOfFile(file.originalname)
        if(extension != 'cpp') {
            cb(null, false);
            return cb(new Error("Only .cpp file are allowed to submit"))
        } else {
            cb(null, true)
        }
    }
  }).single('submitfile');

route.post('/submit', (req, res) => {
    upload(req, res, function(err) {
        if(err) {
            req.flash('error', err.message)
            res.redirect('/contests/' + req.session.contestId)
            return
        }
        req.flash('info', 'Submit file successfully')
        res.redirect('/contests/' + req.session.contestId)
    })
})

module.exports = route