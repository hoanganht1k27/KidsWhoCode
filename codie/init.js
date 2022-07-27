

const dotenv = require('dotenv')

dotenv.config({path: 'config.env'})
const connectDB = require('./server/database/connection')

const mongoose = require('mongoose')

// mongo connection
connectDB();

const {addNewUser} = require('./server/controller/userController')

// let t = await addNewUser({username: 'admin',fullname: 'ADMIN',password: '1',isAdmin: 1})

async function init() {
    let t = await addNewUser({username: 'admin',fullname: 'ADMIN',password: '1',isAdmin: 1})
    if(t) {
        console.log("Create user successfully, your admin username is admin and password is 1. Have fun!!!")
        mongoose.connection.close()
    } else {
        console.log("Some error has occured, please check connection to database or evironment variable, try to follow to install guide!!!")
        mongoose.connection.close()
    }
}

init()



