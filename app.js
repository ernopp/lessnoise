const express = require('express')

const createError = require('http-errors')
const logger = require('morgan')
const session = require('express-session')

const indexRouter = require('./routes/index')
const signInRouter = require('./routes/signin')
const unfollowRouter = require('./routes/unfollow')
const path = require('path')

inspect = require('util-inspect')
app = express()

// View engine Startup & Options
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Passing a built-in function - express.static - to handle static files. https://expressjs.com/en/4x/api.html#express.static
app.use(express.static(path.join(__dirname, 'public')))

// set up session cookie
console.log(app.get('env'))

var sess = {
    secret: 'keyboard cat',
    cookie: {},
    resave: false,
    saveUninitialized: false
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

// app.use(session({ secret: "very secret", cookie: { maxAge: 60000 } }))

//Routes
app.use('/', indexRouter)
app.use('/signin', signInRouter)
app.use('/unfollow', unfollowRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message //https://expressjs.com/en/api.html#res.locals
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
