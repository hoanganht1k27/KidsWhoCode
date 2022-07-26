const express = require('express')
const { getContestById, deleteContestById, getAllProblemsOfContest } = require('../controller/contestController')
const { comparePassword, hashPassword } = require('../services/password')
const route = express.Router()

route.get('/:id', async (req, res) => {
    let contestId = req.params['id']
    let c = await getContestById(contestId)
    let p = await getAllProblemsOfContest(contestId)
    // console.log(p)
    if(c) {
        res.render('contest', {fullname: req.user.fullname, isAdmin: req.user.isAdmin, contest: c, problems: p, showContest: 0})
    } else {
        req.flash('error', "No contest with that id")
        res.redirect('/admin')
    }
})

route.post('/edit-contest', async (req, res) => {
    let {contestnewpassword, contestnewpasswordconfirm, start, contestid} = req.body
    let c = await getContestById(contestid)
    if(c) {
        if(contestnewpassword && contestnewpassword == contestnewpasswordconfirm) {
            c.password = await hashPassword(contestnewpassword)
            c.start = start
            c.save()
                .then(() => {
                    req.flash('info', 'Update contest successfully')
                    res.redirect('/admin/contest/' + contestid)
                })
                .catch((e) => {
                    req.flash('error', e.message)
                    res.redirect('/admin')
                })
        } else {
            c.start = start
            c.save()
                .then(() => {
                    req.flash('info', 'Update contest successfully')
                    res.redirect('/admin/contest/' + contestid)
                })
                .catch((e) => {
                    req.flash('error', e.message)
                    res.redirect('/admin')
                })
        }
    } else {
        req.flash('error', 'Update contest failed')
        res.redirect('/admin')
    }
})

route.post('/delete-contest', async (req, res) => {
    let {contestid} = req.body
    let c = await deleteContestById(contestid)
    if(c.deletedCount) {
        req.flash('info', 'Delete contest successfully')
        res.redirect('/admin')
    } else {
        req.flash('error', 'No contest deleted')
        res.redirect('/admin')
    }
})

module.exports = route