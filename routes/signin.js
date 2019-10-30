//Routes oauth flow connect and callback

const consumer = require('../twitter-client');
const express = require('express');
const router = express.Router();
const app = require('../app');
const utils = require('../utils');

router.get('/', function(req, res){
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      // req.session.save();
      console.log("Calling out to twitter for first oauth");
      console.log("------------------------");
      console.log("Session id is: " + req.sessionID);
      console.log("<<"+req.session.oauthRequestToken);
      console.log("<<"+req.session.oauthRequestTokenSecret);
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
});

router.get('/callback', function(req, res){
    console.log("Executing callback");
    console.log(res)
  console.log("------------------------");
  console.log("Session id is: " + req.sessionID);
  console.log("token>>"+req.session.oauthRequestToken);
  console.log("secret>>"+req.session.oauthRequestTokenSecret);
  console.log("oauth_verifier>>"+req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(results) + "]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      
      res.redirect('/');
    }
  });
});

module.exports = router;