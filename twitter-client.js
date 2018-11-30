const config = require('./config')
const oauth = require('oauth')

const _twitterConsumerKey = config.key
const _twitterConsumerSecret = config.secret
const callbackString = "http://localhost:3000/signin/callback"

module.exports = new oauth.OAuth(
  "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
  _twitterConsumerKey, _twitterConsumerSecret, "1.0A", callbackString, "HMAC-SHA1")