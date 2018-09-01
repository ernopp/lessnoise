var express = require('express');
var router = express.Router();
var app = require('../app');

router.get('/home', function(req, res){
    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
      if (error) {
        console.log("error verifying creds: "+error);
        res.redirect('/signin/connect');
      } else {        
        var verifyCredentialsData = JSON.parse(data);
        // var screenName = parsedData.screen_name;
        consumer.get("https://api.twitter.com/1.1/friends/list.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response){
          if(error) {
            res.send("Error getting friends")
          }
          else{            
            var getFriendsListData = JSON.parse(data);
            res.send({verifyCredentialsData, getFriendsListData},200); 
          }
        });
      } 
    });
});

router.get('/connect', function(req, res){
  // res.send(consumer)
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      req.session.save();
      console.log("Double check on 2nd step");
      console.log("------------------------");
      console.log("Session id is: " + req.sessionID);
      console.log("<<"+req.session.oauthRequestToken);
      console.log("<<"+req.session.oauthRequestTokenSecret);
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
  // res.send("here")
});

router.get('/callback', function(req, res){
  console.log("------------------------");
  console.log("Session id is: " + req.sessionID);
  console.log(">>"+req.session.oauthRequestToken);
  console.log(">>"+req.session.oauthRequestTokenSecret);
  console.log(">>"+req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(results) + "]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      
      res.redirect('/signin/home');
    }
  });
});

module.exports = router;