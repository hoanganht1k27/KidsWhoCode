
const User = require('../models/User')
const {hashPassword} = require('../services/password')

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
        return 0
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
exports.addNewUser = addNewUser
exports.getAllUsers = getAllUsers
exports.getUserByUsername = getUserByUsername
exports.getUserById = getUserById
exports.deleteUserById = deleteUserById
exports.deleteUserByUsername = deleteUserByUsername
exports.resetPasswordByUsername = resetPasswordByUsername