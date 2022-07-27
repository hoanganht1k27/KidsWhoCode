
const Problem = require('../models/Problem')
const fs = require('fs')
const path = require('path')
// const Rank = require('../models/Rank')

updateProblemPath = async (problemId, path, name, timeEachTest, scoreEachTest, contestid) => {
    let p = await Problem.findById(problemId)
    p.name = name
    p.path = path
    p.timeEachTest = timeEachTest
    p.scoreEachTest = scoreEachTest
    p.contestId = contestid
    p.sol = 1

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
  
  function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

getAllTestOfProblem = (problemId) => {
    let p = path.join(process.env.BASE_DIR,process.env.UPLOAD_TEST_DIR, problemId)
    try {
        files = fs.readdirSync(p)
    } catch {
        return []
    }
    files = removeItemAll(files, "setup.json")
    files = removeItemAll(files, "sol.cpp")
    files = removeItemAll(files, "sol.exe")
    return files
}

// getAllRankProblems = async () => {
//     let rp = await Rank.findOne()

//     return rp.problems
// }

getProblem = async (problemId) => {
    let p = await Problem.findById(problemId)
    return p
}

// getProblemInfo = async (problemId) => {
//     let p = await Problem.findById(problemId)
//     let files = []
//     try {
//         files = fs.readdirSync(path.join(process.env.UPLOAD_TEST_DIR, problemId))

//         if(files.length < 2) {
//             files = "No test available, please upload this problem\'s tests"
//         }
//         else
//         if(!files.includes("sol.cpp"))
//             files = "No solution file, please upload solution file to this problem\' tests"

//     } catch {
//         files = "No test available, please upload this problem\'s tests"
//     }
    
//     return {
//         problem: p,
//         tests: files
//     }
// }

deleteProblem = async (problemId) => {
    return Problem.deleteOne({'_id': problemId})
}

getProblemName = async(problemId) => {
    try {
        let p = await Problem.findById(problemId)
        return p.name
    } catch {
        return null
    }
}

// getAllShowedTests = async () => {
//     let files = fs.readdirSync(path.join(process.env.SHOW_TEST_DIR))
//     let res = []
//     for(let i = 0; i < files.length; i++) {
//         let d = files[i]
//         let tests = fs.readdirSync(path.join(process.env.SHOW_TEST_DIR, d))
//         let problemName = await getProblemName(d)
//         console.log(problemName)
//         res.push({
//             problemId: d,
//             problemName: problemName,
//             testfiles: tests,
//             dir: process.env.SHOW_TEST_DIR_NAME
//         })
//     }
//     return res
// }

getExtensionOfFile = (filename) => {
    let t = filename.split('.')
    if(t.length < 2) return null
    return t[t.length - 1]
}

getClassOfScore = (score, fullScore) => {
    if(score == fullScore) return 'full_100'
    if(score >= 0.7 * fullScore) return 'full_70'
    if(score > 0) return 'full_50'
    return 'full_0'
}


getAllSubmittedProblems = async (userId) => {
    let result = {}
    try {
        let p = path.join(process.env.BASE_DIR, process.env.RESULTS_DIR, userId + '.json')
        result = fs.readFileSync(p)
        result = JSON.parse(result)
    } catch {

    }

    let res = []

    let k = Object.keys(result)
    for(let i = 0; i < k.length; i++) {
        if(result[k[i]].fullScore) {
            // let name = await getProblemName(k[i])
            // console.log(k[i], name)
            let name = await getProblemName(k[i])
            if(name) {
                res.push({
                    problemId: k[i],
                    status: result[k[i]].status,
                    score: result[k[i]].score, 
                    fullScore: result[k[i]].fullScore,
                    logs: result[k[i]].logs,
                    name: name,
                    classOfScore: getClassOfScore(result[k[i]].score, result[k[i]].fullScore)
                })
            }
        }
    }

    return res

}

getScore = (userId, problemId) => {
    let result = {}
    try {
        let p = path.join(process.env.BASE_DIR, process.env.RESULTS_DIR, userId + '.json')
        result = fs.readFileSync(p)
        result = JSON.parse(result)
    } catch {
    }


    let k = Object.keys(result)
    if(k.includes(problemId)) {
        return {
            status: result[problemId].status,
            score: result[problemId].score, 
            fullScore: result[problemId].fullScore,
            logs: result[problemId].logs,
            classOfScore: getClassOfScore(result[problemId].score, result[problemId].fullScore)
        }
    }
    return null
}

addSettingToProblem = (problemId, timeEachTest, scoreEachTest) => {
    let s = {
        time: timeEachTest,
        scoreEachTest: scoreEachTest
    }

    let p = path.join(process.env.BASE_DIR, process.env.UPLOAD_TEST_DIR, problemId)
    makeDir(p)

    let data = JSON.stringify(s)
    p = path.join(p, 'setup.json')

    fs.writeFileSync(p, data)
}


exports.updateProblemPath = updateProblemPath
exports.getAllProblems = getAllProblems
exports.makeDir = makeDir
exports.getAllTestOfProblem = getAllTestOfProblem
// exports.getProblemInfo = getProblemInfo
exports.deleteProblem = deleteProblem
// exports.getAllShowedTests = getAllShowedTests
exports.getAllSubmittedProblems = getAllSubmittedProblems
exports.getExtensionOfFile = getExtensionOfFile
exports.addSettingToProblem = addSettingToProblem
exports.getProblem = getProblem
// exports.getAllRankProblems = getAllRankProblems
exports.getScore = getScore