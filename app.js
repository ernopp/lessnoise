/* Twitter app settings: https://apps.twitter.com/app/5573851/settings */

var createError = require('http-errors')
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var logger = require('morgan')

var session = require('express-session')
// var session = require('cookie-session');

var oauth = require('oauth')

var indexRouter = require('./routes/index')
var signInRouter = require('./routes/signin')

const consumer = require('./twitter-client')

//Not declare them as new vars to make them accessible in routes/, not sure if right way of doing it (TODO)
inspect = require('util-inspect')
app = express()

//Create Twitter OAuth object
const config = require('./config')
const callbackString = "http://localhost:3000/signin/callback"

// var _twitterConsumerKey = config.key
// var _twitterConsumerSecret = config.secret
//
// console.log(_twitterConsumerSecret)
// console.log(_twitterConsumerKey)
//
// global.consumer = new oauth.OAuth(
//   "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
//   _twitterConsumerKey, _twitterConsumerSecret, "1.0A", callbackString, "HMAC-SHA1")


//Mongo
// MongoClient = require('mongodb').MongoClient;
// url = 'mongodb://localhost/lessnoise'

// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db){
//   if(err){
//   	throw err;
//   }
//   console.log("Connected");      

//   dbo = db.db("lessnoise");
// });

// View engine Startup & Options
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Passing a built-in function - express.static - to handle static files. https://expressjs.com/en/4x/api.html#express.static
app.use(express.static(path.join(__dirname, 'public')))

// https://nodewebapps.com/2017/06/18/how-do-nodejs-sessions-work/
app.use(session({ secret: "very secret" }))

//Routes
app.use('/', indexRouter)
app.use('/signin', signInRouter)

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
