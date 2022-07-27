const Problem = require("../models/Problem")
const { getAllTestOfProblem } = require("../services/problem")


getProblemById = async (id) => {
    let p = await Problem.findById(id)
    let files = getAllTestOfProblem(id)
    return {
        problem: p,
        tests: files
    }
}

updateProblem = async (id, timeEachTest, scoreEachTest, filename) => {
    let p = await Problem.findById(id)
    if(p) {
        p.timeEachTest = timeEachTest
        p.scoreEachTest = scoreEachTest
        if(filename) {
            p.path = filename
        }
        return p.save()
    }
    return null
}

exports.getProblemById = getProblemById
exports.updateProblem = updateProblem