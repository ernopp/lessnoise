/* Twitter client - app settings: https://apps.twitter.com/app/5573851/settings */

const config = require('./config')
const oauth = require('oauth')

const _twitterConsumerKey = config.key
const _twitterConsumerSecret = config.secret
const callbackString = "http://localhost:" + process.env.PORT  + "/signin/callback"

module.exports = new oauth.OAuth(
  "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
  _twitterConsumerKey, _twitterConsumerSecret, "1.0A", callbackString, "HMAC-SHA1")