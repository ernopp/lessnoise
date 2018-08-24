var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var oauth = require('oauth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signInRouter = require('./routes/signin');

//Not declare them as new vars to make them accessible in routes/, not sure if right way of doing it (TODO)
inspect = require('util-inspect');
app = express();

//Create Twitter OAuth object
const config = require('./config');
const callbackString = "http://127.0.0.1:3000/signin/callback"

var _twitterConsumerKey = config.key;
var _twitterConsumerSecret = config.secret;

console.log(_twitterConsumerSecret)
console.log(_twitterConsumerKey)

consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
    _twitterConsumerKey, _twitterConsumerSecret, "1.0A", callbackString, "HMAC-SHA1");

// View engine Startup & Options
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//TODO figure out belw line
app.use(session({ secret: "very secret", resave: false, saveUninitialized: true}));

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signin', signInRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message; //https://expressjs.com/en/api.html#res.locals
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
