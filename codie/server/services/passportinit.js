const passport = require('passport')

const initializePassport = require('../../passport-config')
initializePassport(passport)

module.exports = passport