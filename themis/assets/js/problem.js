$(document).ready(function() {
    // $('.deleteTest').on('click', (e) => {
    //     let link = $(this).prev('a')
    //     link = link.prevObject[0].URL
    //     $.ajax({
    //         url: link,
    //         type: 'DELETE'
    //     })
    //     location.reload()
    // })

    $('.deleteTest').click(function(e) {
        let t = $(this).prev('a')
        let url = $(t).attr('href')
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function (data, textStatus, xhr) {
                location.reload()
            },
            error: function (xhr, textStatus, errorThrown) {
                location.reload()
            }
        })
    })
})