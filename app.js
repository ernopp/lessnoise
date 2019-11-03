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

// View engine Startup & Options
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

https://github.com/expressjs/morgan#morganformat-options
app.use(logger('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(compression())

// Passing a built-in function - express.static - to handle static files. https://expressjs.com/en/4x/api.html#express.static
app.use(express.static(path.join(__dirname, 'public')))

// set up session cookie
console.log("environment is: "+ app.get('env'))
console.log("usetestdata is: "+ process.env.USETESTDATA)

var sess = {
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    // sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

//Routes
app.use('/', indexRouter)
app.use('/signin', signInRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Page not found.")
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    debug("in dev error handler")
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app
