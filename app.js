const express = require('express')

const createError = require('http-errors')
const logger = require('morgan')
const session = require('cookie-session')
const compression = require('compression')
const debug = require('debug')('lessnoise:app')
const path = require('path')
const config = require('./config')

const indexRouter = require('./routes/index')
const signInRouter = require('./routes/signin')
const unfollowRouter = require('./routes/unfollow')

inspect = require('util-inspect')
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

console.log("config is " + inspect(config))

var sess = {
    secret: config.sessionsecret,
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
app.use('/unfollow', unfollowRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message //https://expressjs.com/en/api.html#res.locals
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
