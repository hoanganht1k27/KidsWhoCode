$(document).ready(function() {
    $('.submittedEach').on('click', function(e) {
        let problemId = $(this).attr('problemId')
        // console.log(this)
        let t = $('.submittedLog')
        for(let i = 0; i < t.length; i++) {
            if($(t[i]).attr('problemId') && $(t[i]).attr('problemId') == problemId) {
                let status = $(t[i]).attr('status')
                let score = $(t[i]).attr('score')
                let name = $(t[i]).attr('problemName')
                let s = $(t[i]).html()
                // s = s.plit('\n')
                $('#showLogBody').html(`<p>Status: ${status}</p><p>Score: ${score}</p><textarea class="showLogText">${s}</textarea>`)
                $('#showLogModalLabel').html(name)
                $('#showLog').click()
            }
        }
    })
})