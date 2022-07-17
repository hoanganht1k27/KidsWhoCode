
const User = require('../models/User')
const {hashPassword, comparePassword} = require('../services/password')

addNewUser = async ({username, fullname, password, isAdmin}) => {
    hashedPassword = await hashPassword(password)
    let u = new User({
        username: username,
        fullname: fullname,
        password: hashedPassword,
        avaurl: 'no_ava.png',
        isAdmin: isAdmin
    })

    try {
        let t = await u.save()
        return t
    } catch(err) {
        return {
            error: err.message,
            username: username
        }
    }
}

getAllUsers = async () => {
    let users = await User.find()
    return users
}

getUserByUsername = async (username) => {
    let user = await User.findOne({'username': username})

    return user
}

getUserById = async (userid) => {
    let user = await User.findOne({'_id': userid})

    return user
}

deleteUserById = async (userid) => {
    let u = await User.deleteOne({'_id': userid})

    return u
}

deleteUserByUsername = async (username) => {
    let u = await User.deleteOne({'username': username})
    
    return u
}

resetPasswordByUsername = async (username) => {
    let u = await User.findOne({'username': username})

    let resetPassword = await hashPassword("1")

    u.password = resetPassword

    let res = await u.save()
    return res
    
}

updateAvaurl = async (avaurl, userId) => {
    let u = await User.findById(userId)

    u.avaurl = avaurl

    return u.save()
}

compareCurrentPassword = async (userId, oldpassword) => {
    let u = await User.findById(userId)
    let t = await comparePassword(oldpassword, u.password)
    return t
}

updatePassword = async (userId, newpassword) => {
    let u = await User.findById(userId)
    newpassword = await hashPassword(newpassword)

    u.password = newpassword

    return u.save()
}

exports.addNewUser = addNewUser
exports.getAllUsers = getAllUsers
exports.getUserByUsername = getUserByUsername
exports.getUserById = getUserById
exports.deleteUserById = deleteUserById
exports.deleteUserByUsername = deleteUserByUsername
exports.resetPasswordByUsername = resetPasswordByUsername
exports.updateAvaurl = updateAvaurl
exports.compareCurrentPassword = compareCurrentPassword
exports.updatePassword = updatePassword