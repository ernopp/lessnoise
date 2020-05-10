const express = require('express')

const logger = require('morgan')
const session = require('cookie-session')
const compression = require('compression')
const debug = require('debug')('lessnoise:app')
const path = require('path')
require('dotenv').config()

const indexRouter = require('./routes/index')
const signInRouter = require('./routes/signin')

inspect = require('util-inspect') //https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
app = express()

// https://github.com/expressjs/session#resave
var sess = {
    secret: process.env.SESSIONSECRET,
    resave: true,
    saveUninitialized: true
}

app.use(session(sess))

// View engine Startup & Options
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// https://github.com/expressjs/morgan#morganformat-options
app.use(logger('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(compression())

// Passing a built-in function - express.static - to handle static files. https://expressjs.com/en/4x/api.html#express.static
app.use(express.static(path.join(__dirname, 'public')))

// set up session cookie
console.log("environment is: "+ app.get('env'))
console.log("usetestdata is: "+ process.env.USETESTDATA)
console.log("PORT is: "+ process.env.PORT)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    // sess.cookie.secure = true // serve secure cookies
}

//Routes
app.use('/', indexRouter)
app.use('/signin', signInRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Page not found.")
    err.status = 404
    next(err)
})

app.use(function(err, req, res, next) {
    debug("throwing error to user, err is " + err.message)
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    })
})

module.exports = app
