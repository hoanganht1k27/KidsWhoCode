

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
    next()
}

exports.checkAuthenticatedUser = checkAuthenticatedUser
exports.checkNotAuthenticatedUser = checkNotAuthenticatedUser