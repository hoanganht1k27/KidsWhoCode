

const { getContestById } = require('../controller/contestController')
const Problem = require('../models/Problem')

checkAuthenticatedUser = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

checkNotAuthenticatedUser = (req, res, next) => {
    if(req.isAuthenticated()) {
        res.redirect('/')
    }
    return next()
}

checkAdminAuthenticatedUser = (req, res, next) => {
    if(req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.redirect('/')
}

addProblemToDB = async (req, res, next) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;
    let p = new Problem({
        uploaded_at: Date.now(),
        uploaded_at_nice: formattedToday
    })
    await p.save()

    req.problemId = p._id.toString()
    return next()
}

checkContest = async (req, res, next) => {
    let contestId = req.params['id']
    let contest = await getContestById(contestId)
    if(contest.start == false) {
        req.flash('error', 'Contest is not started, cannot join in')
        return res.redirect('/')
    }
    if(req.session.contestId && req.session.contestId == contestId) {
        return next()
    }
    return res.redirect('/')
}

exports.checkAuthenticatedUser = checkAuthenticatedUser
exports.checkNotAuthenticatedUser = checkNotAuthenticatedUser
exports.checkAdminAuthenticatedUser = checkAdminAuthenticatedUser
exports.addProblemToDB = addProblemToDB
exports.checkContest = checkContest