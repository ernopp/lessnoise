var express = require('express');
var router = express.Router();
var app = require('../app');
var utils = require('../utils');

/* GET home page. */
router.get('/', function(req, res, next) {
    
  consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
      if (error) {
        console.log("error verifying creds trying to connect: ", JSON.stringify(error));
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
      	//https://developer.twitter.com/en/docs/basics/cursoring
		var nextcursorstr = "-1";        
		var nextcursor = -1;
		var rawFriendsList = {};		

		 while(nextcursor !=0){
			// console.log("nextcursor is " + nextcursor);

			consumer.get("https://api.twitter.com/1.1/friends/list.json?cursor="+nextcursorstr, req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response){
	          if(error) {
	          	var e = JSON.stringify(error)
	            console.log("Error getting friends, error: ", e);
	            res.send("Hmm, you are authenticated but couldn't get back friends list from twitter api, error: "+e, 500)
	          }
	          else{                  
	          	console.log("-------------GOT DATA BACK --------, number of objects: ", data["total_count"]);
	          	console.log(data);
	          	nextcursorstr = data["next_cursor_str"];	          		          	
	          	nextcursor = data["next_cursor"];	          		          	

	          	// rawFriendsList = rawFriendsList.concact(JSON.parse(data)["users"])
	          	// console.log(JSON.stringify(rawFriendsList))
			  }  
			});
		  }	       
        		// var transformedFriendsList = utils.transformFriendsList(rawFriendsList);
       			// var prettyFriendsList = utils.getPrettyFriendsList(transformedFriendsList);
       			//   console.log(prettyFriendsList);

     //      	  "next_cursor": 1613662072812786926,
			  // "next_cursor_str": "1613662072812786926",
			  // "previous_cursor": 0,
			  // "previous_cursor_str": "0",
			  // "total_count": null


            // save to mongodb
            // dbo.collection("users").insertMany(transformedFriendsList, function(err, res) {
            //   if (err) throw err;
            //   console.log("Number of documents inserted: " + res.insertedCount);
            //   dbo.close();
            // });
        
        // https://expressjs.com/en/api.html#res.render
        // res.render('index', {title: 'LessNoise', prettyFriendsList: prettyFriendsList});
      }
    }); // consumer.get friends list         
});

module.exports = router;
