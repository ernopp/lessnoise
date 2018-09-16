var express = require('express');
var router = express.Router();
var app = require('../app');
var utils = require('../utils');

router.get('/home', function(req, res){

    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
      if (error) {
        console.log("error verifying creds: "+error);
        res.redirect('/signin/connect');
      } else {        
        console.log("verifycredentials data: " , data);

        if (!utils.IsJsonString(data))
          throw "Error - received creds data not a valid json !"
        //save the logged in user's info in twitterIdentifier json object. used later to identify their friends in the database
        var verifyCredentialsData = JSON.parse(data);
        var twitterIdentifier = {};
        twitterIdentifier["id"] = verifyCredentialsData["id"];
        twitterIdentifier["name"] = verifyCredentialsData["name"];
        twitterIdentifier["screen_name"] = verifyCredentialsData["screen_name"];

        //get friends list 
        consumer.get("https://api.twitter.com/1.1/friends/list.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response){
          if(error) {
            res.send("Error getting friends")
          }
          else{                  
            // console.log("successfully got friends ")
            // console.log("------data---------")
            // console.log(data)
            console.log("-------data.users--------")
            console.log(JSON.parse(data)["users"])
            var rawFriendsList = JSON.parse(data)["users"];            
            var transformedFriendsList = utils.transformFriendsList(rawFriendsList);

            dbo.collection("users").insertMany(transformedFriendsList, function(err, res) {
              if (err) throw err;
              console.log("Number of documents inserted: " + res.insertedCount);
              dbo.close();
            });

            res.send(rawFriendsList,200); 
          }
        }); // consumer.get friends list         
    }// else
  });
}); //router.get

router.get('/connect', function(req, res){
  // res.send(consumer)
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      // req.session.save();
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
    //consumer.getOAuthAccessToken(req.query.oauthRequestToken, req.query.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
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