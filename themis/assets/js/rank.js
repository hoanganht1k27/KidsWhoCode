let users = []
let problems = []
let a = []

$.get('/allusers', (data) => {
    users = data
})

$.get('/allproblems', (data) => {
    problems = data
})

setTimeout(loadRank, 1000)

function renderRank() {
    let html = "<tr><th>Rank</th><th>Name</th><th>Sum</th>"
    for(let i = 0; i < problems.length; i++) {
        let p = problems[i]
        // console.log(p)
        html = html + `<th>${p.name}</th>`
    }
    html += '</tr>'
    $('tbody').append(html)

    html = '';

    for(let i = 0; i < a.length; i++) {
        html += `<tr><td>${i + 1}</td><td>${a[i].fullname}</td><td>${a[i].sum}</td>`
        for(let j = 0; j < problems.length; j++) {
            let p = problems[j]
            if(a[i][p._id].classOfScore)
            html += `<td class="${a[i][p._id].classOfScore}">${a[i][p._id].score}</td>`
            else
            html += `<td></td>`
        }
        html += '</tr>'
        $('tbody').append(html)
        html = ''
    }
    
}

function loadRank() {
    $.get('/allusers', (data) => {
        users = data
        $.get('/allproblems', async (data) => {
            problems = data
            let b = []
            for(let i = 0; i < users.length; i++) {
                let u = users[i]
                let c = {}
                c["userId"] = u._id
                c["fullname"] = u.fullname
                c["sum"] = 0
                let s = 0
                let promises = []
                for(let j = 0; j < problems.length; j++) {
                    let p = problems[j]
                    promises.push(fetch('/score/' + u._id + '/' + p._id).then((res) => {return res.json()}).then((data) => {if(data) return data; else return null}))
                }
                let t = await Promise.all(promises)
                for(let j = 0; j < problems.length; j++) {
                    let p = problems[j]
                    if(t[j] != {}) {
                        if(typeof(t[j].score) == "number")
                        s += t[j].score
                        c[p._id] = {
                            score: t[j].score,
                            problemName: p.name,
                            classOfScore: t[j].classOfScore
                        }
                    } else {
                        c[p._id] = {
                            score: null,
                            problemName: p.name,
                            classOfScore: null
                        }
                    }

                }
                c['sum'] = s
                b.push(c)
            }
            b.sort(function(x,y){
                if(x.sum == y.sum){
                  return -1;
                }
              
                return x.sum < y.sum ? 1 : -1;
            });
            if(b != a) {
                let c = b
                a = c;
                $('tbody').html('')
                renderRank();
            }
            setTimeout(() => {
                loadRank()
            }, 1000)
        })
    })
    
}
