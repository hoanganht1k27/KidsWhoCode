

const {hashPassword} = require('../services/password')
const Contest = require('../models/Contest')
const Problem = require('../models/Problem')


addContest = async (contestname, contestpassword, start) => {
    let hashContestPassword = await hashPassword(contestpassword)

    // console.log(contestname, contestpassword, start)

    let c = new Contest({
        name: contestname,
        password: hashContestPassword,
        start: start
    })
    
    return c.save()
}

getAllContest = async () => {
    let c = await Contest.find()
    return c
}

getContestById = async (id) => {
    let c = await Contest.findById(id)
    return c
}

deleteContestById = async (id) => {
    let c = await Contest.deleteOne({_id: id})
    return c
}

getAllProblemsOfContest = async (id) => {
    let p = await Problem.find({contestId: id})
    return p
}

exports.addContest = addContest
exports.getAllContest = getAllContest
exports.getContestById = getContestById
exports.deleteContestById = deleteContestById
exports.getAllProblemsOfContest = getAllProblemsOfContest