
const User = require('../models/User')
const {hashPassword} = require('../services/password')

addNewUser = async ({username, fullname, password}) => {
    hashedPassword = await hashPassword(password)
    let u = new User({
        username: username,
        fullname: fullname,
        password: hashedPassword,
        avaurl: 'no_ava.png'
    })

    u.save()
            .then((user) => {
                console.log("new user created")
            })
            .catch((err) => {
                console.log(err)
            })
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

exports.addNewUser = addNewUser
exports.getAllUsers = getAllUsers
exports.getUserByUsername = getUserByUsername
exports.getUserById = getUserById