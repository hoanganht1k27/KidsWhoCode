
const Problem = require('../models/Problem')
const fs = require('fs')
const path = require('path')

updateProblemPath = async (problemId, path, name) => {
    let p = await Problem.findById(problemId)
    p.name = name
    p.path = path

    return p.save()
}

getAllProblems = async () => {
    let p = await Problem.find()
    return p
}

makeDir = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

getAllTestOfProblem = (problemId) => {
    let p = path.join(process.env.UPLOAD_TEST_DIR, problemId)
    files = fs.readdirSync(p)
    return files
}

getProblemInfo = async (problemId) => {
    let p = await Problem.findById(problemId)
    let files = []
    try {
        files = fs.readdirSync(path.join(process.env.UPLOAD_TEST_DIR, problemId))
    } catch {
        files = "No test available, please upload this problem\'s tests"
    }
    
    return {
        problem: p,
        tests: files
    }
}

deleteProblem = async (problemId) => {
    return Problem.deleteOne({'_id': problemId})
}

getProblemName = async(problemId) => {
    let p = await Problem.findById(problemId)
    return p.name
}

getAllShowedTests = async () => {
    let files = fs.readdirSync(path.join(process.env.SHOW_TEST_DIR))
    let res = []
    for(let i = 0; i < files.length; i++) {
        let d = files[i]
        let tests = fs.readdirSync(path.join(process.env.SHOW_TEST_DIR, d))
        let problemName = await getProblemName(d)
        console.log(problemName)
        res.push({
            problemId: d,
            problemName: problemName,
            testfiles: tests,
            dir: process.env.SHOW_TEST_DIR_NAME
        })
    }
    return res
}


exports.updateProblemPath = updateProblemPath
exports.getAllProblems = getAllProblems
exports.makeDir = makeDir
exports.getAllTestOfProblem = getAllTestOfProblem
exports.getProblemInfo = getProblemInfo
exports.deleteProblem = deleteProblem
exports.getAllShowedTests = getAllShowedTests