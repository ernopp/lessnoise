var express = require('express');
var router = express.Router();
var app = require('../app');

router.get('/home', function(req, res, next){
  //TODO figure out encrypted cookie save of the access token
  //TODO - move this into index.js top level route
    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
      if (error) {
        //console.log(error)
        res.redirect('/signin/connect');
      } else {
        var parsedData = JSON.parse(data);
        //res.send('You are signed in: ' + inspect(parsedData.screen_name) +'\n data is ' + parsedData);
        var output = 'You are signed in: ' + inspect(parsedData.screen_name) +'\n data is ' + parsedData;
        Console.log('You are signed in: ' + inspect(parsedData.screen_name) +'\n data is ' + parsedData);
      } 
    },
    next();      
  },
  function (req, res, next){
    Console.log('2222');
    res.send(output.concat("222222"))    
});

router.get('/connect', function(req, res){
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      console.log("Double check on 2nd step");
      console.log("------------------------");
      console.log("<<"+req.session.oauthRequestToken);
      console.log("<<"+req.session.oauthRequestTokenSecret);
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
});

router.get('/callback', function(req, res){
  console.log("------------------------");
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