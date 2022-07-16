
processInputForAdd = (s) => {
    let arr = s.split('\n')

    let res = []

    for(let i = 0; i < arr.length; i++) {
        let t = arr[i].split('-')
        if(t.length == 4) {
            res.push({
                username: t[0].trim(),
                fullname: t[1].trim(),
                password: t[2].trim(),
                isAdmin: t[3] == '1' ? 1 : 0
            })
        }
    }
    
    return res
}

processInputForDelete = (s) => {
    let arr = s.split('\n')

    let res = []
    for(let i = 0; i < arr.length; i++) {
        let t = arr[i].split(' ')
        if(t.length == 1) {
            if(!t[0].includes('-')) {
                res.push({
                    username: t[0].trim()
                })
            }
        }
    }

    return res;
}

processInputForReset = (s) => {
    let arr = s.split('\n')

    let res = []
    for(let i = 0; i < arr.length; i++) {
        let t = arr[i].split(' ')
        if(t.length == 1) {
            if(!t[0].includes('-')) {
                res.push({
                    username: t[0].trim()
                })
            }
        }
    }

    return res;
}

exports.processInputForAdd = processInputForAdd
exports.processInputForDelete = processInputForDelete
exports.processInputForReset = processInputForReset