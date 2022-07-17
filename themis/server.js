const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('morgan')
const dotenv = require('dotenv')
const path = require('path')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const connectDB = require('./server/database/connection')

const {checkNotAuthenticatedUser} = require('./server/services/middleware')

const app = express()

dotenv.config({path: 'config.env'})

const port = process.env.PORT || 2323

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(logger('dev'))
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_lkl',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// mongo connection
connectDB();

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/images', express.static(path.resolve(__dirname, "assets/images")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/' + process.env.SHOW_TEST_DIR_NAME, express.static(path.resolve(__dirname, "assets/" + process.env.SHOW_TEST_DIR_NAME)))
app.use('/problems', express.static(path.resolve(__dirname, "assets/problems")))

app.use('/', require('./server/routes/router'))

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(port, () => {
    console.log("Listening on port " + port)
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnect')
    })

    socket.on('chat message', (data) => {
        io.emit('chat message', data)
    })
});