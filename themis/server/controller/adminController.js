
const {addNewUser, deleteUserByUsername, resetPasswordByUsername} = require('./userController')

addUsers = async (arr) => {
    let p = []
    for(let i = 0; i < arr.length; i++) {
        p.push(addNewUser(arr[i]))
    }

    let res = await Promise.all(p)

    return res
}

deleteUsers = async (arr) => {
    let p = []
    for(let i = 0; i < arr.length; i++) {
        p.push(deleteUserByUsername(arr[i].username))
    }

    let res = await Promise.all(p)

    return res
}

resetUsers = async (arr) => {
    let p = []
    for(let i = 0; i < arr.length; i++) {
        p.push(resetPasswordByUsername(arr[i].username))
    }

    let res = await Promise.all(p)

    return res
}

exports.addUsers = addUsers
exports.deleteUsers = deleteUsers
exports.resetUsers = resetUsers