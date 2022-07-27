const socket = io()

const userid = $('.chatContainer').attr('userid')
const username = $('.chatContainer').attr('username')
const avaurl = $('.chatContainer').attr('avaurl')

let preSend = Date.now()
let spam = 0
let spamed = 0

socket.on('chat message', (data) => {
    if(data.userid == userid) {
        $('.chatContainer').append(
            `<div class="message">
                <div class="messageContainer mine">
                    <div class="messageContentMe">
                        <p>${data.message}</p>
                    </div>
                </div>
            </div>`
        )
    } else {
        $('.chatContainer').append(
            `<div class="message">
                <div class="messageContainer everyone">
                    <div class="avaContainer">
                        <img src="images/${data.avaurl}" class="avatar" alt="">
                    </div>
                    <div class="messageContent">
                        <b>${data.username}</b>
                        <p>${data.message}</p>
                    </div>
                </div>
            </div>`
        )
    }
    $(".chatContainer").animate({ scrollTop: $('.chatContainer').prop("scrollHeight")}, 1000);
})

function sendMessage(messageContent) {
    if(messageContent == '') {
        return
    }
    $.post('/chat/add-message', {
        message: messageContent,
        userid: userid,
        username: username,
        avaurl: avaurl,
        sent_at: Date.now()
    }).done(function(data, status) {
        socket.emit('chat message', data.data)
        // console.log(data, status )
    }).fail(function(err, status) {
        console.log(JSON.parse(err.responseText), status)
    })
}

$(document).ready(function() {
    $(".chatContainer").animate({ scrollTop: $('.chatContainer').prop("scrollHeight")}, 1000);
    $('.messageInput').on('keydown', (e) => {
        if(spamed) return
        if(e.which == 13) {
            sendMessage($('.messageInput').val())
            $('.messageInput').val('')
        }
    })
    $('.messageSubmit').on('click', (e) => {
        if(spamed) return
        sendMessage($('.messageInput').val())
        $('.messageInput').val('')
    })
})