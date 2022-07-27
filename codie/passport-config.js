

const {getUserByUsername, getUserById} = require('./server/controller/userController')
const {comparePassword} = require('./server/services/password')

const LocalStrategy = require('passport-local').Strategy

function initialize(passport) { 
    const authenticateUser = async (username, password, done) => {
            const user = await getUserByUsername(username)
            if(user == null) {
                return done(null, false, {message: 'No user with that username'})
            }

            try {
                if(await comparePassword(password, user.password)) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: "Password incorrect"})
                }
            } catch(e) {
                return done(e)
            }
             
        }
    passport.use(new LocalStrategy({usernameField: 'username'},
        authenticateUser))
    passport.serializeUser((user, done) => {done(null, user._id) })
    passport.deserializeUser(async (id, done) => {
        let u = await getUserById(id)
        done(null, u) 
    })
}

module.exports = initialize