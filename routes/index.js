var express = require('express');
var router = express.Router();
var app = require('../app');
var utils = require('../utils');

/* GET home page. */
router.get('/', function(req, res, next) {
    
  consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
      if (error) {
        console.log("error verifying creds: ", JSON.stringify(error));
        res.redirect('/signin/connect');
      } else {        
        console.log("successfully verified creds. data: " , data);

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
            console.log("Error getting friends, error: ", JSON.stringify(error));
          }
          else{                  
            // console.log("successfully got friends ")
            // console.log("------data---------")
            // console.log(data)
            // console.log("-------data.users--------")
            // console.log(JSON.parse(data)["users"])

            var rawFriendsList = JSON.parse(data)["users"];            
            var transformedFriendsList = utils.transformFriendsList(rawFriendsList);
            var prettyFriendsList = utils.getPrettyFriendsList(transformedFriendsList);

            // dbo.collection("users").insertMany(transformedFriendsList, function(err, res) {
            //   if (err) throw err;
            //   console.log("Number of documents inserted: " + res.insertedCount);
            //   dbo.close();
            // });

            console.log(prettyFriendsList);
            
            // https://expressjs.com/en/api.html#res.render
            res.render('index', {title: 'LessNoise', prettyFriendsList: prettyFriendsList});
          }
        }); // consumer.get friends list         
    }// else
  });

});



module.exports = router;
