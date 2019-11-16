//Routes oauth flow connect and callback

const consumer = require('../twitter-client')
const express = require('express')
const router = express.Router()
const app = require('../app')
const debug = require('debug')('lessnoise:signin')
const verbosedebug = require('debug')('lessnoise-verbose:signin')
const utils = require('../utils')

router.get('/', function(req, res, next){
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      debug("error getting oauth request token" + inspect(error))
      next(error)
      // res.send("Error getting OAuth request token : " + inspect(error), 500)
    } else {  
      req.session.oauthRequestToken = oauthToken
      req.session.oauthRequestTokenSecret = oauthTokenSecret
      // req.session.save()
      verbosedebug("Calling out to twitter for first oauth")
      verbosedebug("------------------------")
      verbosedebug("Session id is: " + req.sessionID)
      verbosedebug("<<"+req.session.oauthRequestToken)
      verbosedebug("<<"+req.session.oauthRequestTokenSecret)
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken)      
    }
  })
})

router.get('/callback', function(req, res, next){
  verbosedebug("Executing callback")
  verbosedebug("------------------------")
  verbosedebug("Session id is: " + req.sessionID)
  verbosedebug("token>>"+req.session.oauthRequestToken)
  verbosedebug("secret>>"+req.session.oauthRequestTokenSecret)
  verbosedebug("oauth_verifier>>"+req.query.oauth_verifier)
  try{
      consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
          req.session.oauthAccessToken = oauthAccessToken
          req.session.oauthAccessTokenSecret = oauthAccessTokenSecret

          res.redirect('/')
      })
  }
  catch (err) {
        next(err)
  }
})

module.exports = router