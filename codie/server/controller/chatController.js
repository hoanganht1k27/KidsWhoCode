

const Message = require('../models/Message')

addMessage = async ({message, userid, username, avaurl, sent_at}) => {
    let t = new Message({
        message: message,
        userid: userid,
        username: username,
        avaurl: avaurl, 
        sent_at: sent_at
    })

    return t.save()
}

getAllMessages = async () => {
    let t = await Message.find()

    return t
}

exports.addMessage = addMessage
exports.getAllMessages = getAllMessages