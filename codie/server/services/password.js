const bcrypt = require('bcrypt')
const saltRounds = 10

hashPassword = async (plainPassword) => {
    try {
        let hashedPassword = await bcrypt.hash(plainPassword, 10)
        return hashedPassword
    } catch {
        return -1
    }
}

comparePassword = async (plainPassword, hashedPassword) => {
    let res = await bcrypt.compare(plainPassword, hashedPassword)
    return res
}

exports.hashPassword = hashPassword
exports.comparePassword = comparePassword