const consumer = require('../twitter-client')
const express = require('express')
const router = express.Router()
const app = require('../app')
const utils = require('../utils')

/* GET home page. */
router.get('/', function (req, res, next) {
    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, async function (error, data, response) {
        if (error) {
            console.log("error verifying creds trying to connect: ", JSON.stringify(error))
            res.redirect('/signin/connect')
        } else {
            console.log("successfully verified creds. data: ", data)

            if (!utils.IsJsonString(data))
                throw "Error - received creds data not a valid json !"

            //save the logged in user's info in twitterIdentifier json object. used later to identify their friends in the database
            var verifyCredentialsData = JSON.parse(data)
            var twitterIdentifier = {}
            twitterIdentifier["id"] = verifyCredentialsData["id"]
            twitterIdentifier["name"] = verifyCredentialsData["name"]
            twitterIdentifier["screen_name"] = verifyCredentialsData["screen_name"]

            //get friends list
            //https://developer.twitter.com/en/docs/basics/cursoring
            let nextcursor = -1
            const rawFriendsList = []

            while (nextcursor !== 0) {
                console.log("-----nextcursor is ", nextcursor)
                try {
                    const twitterResponse = await getFriends(
                        nextcursor,
                        req.session.oauthAccessToken,
                        req.session.oauthAccessTokenSecret
                    );
                    nextcursor = twitterResponse["next_cursor"];

                    for (let i = 0; i < twitterResponse["users"].length; i++) {
                        console.log("adding friend " + twitterResponse.users[i])
                        rawFriendsList.push(twitterResponse.users[i]);
                    }
                } catch (err) {
                    return next(err);
                }
            }

            // getFriends(
            //     nextcursor,
            //     req.session.oauthAccessToken,
            //     req.session.oauthAccessTokenSecret
            // );

            console.log("-----Finished cursoring-----")

            console.log("rawFriendsList has size : " , rawFriendsList.length);

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
    })
})

function getFriends(cursor, oauthAccessToken, oauthAccessTokenSecret) {
    return new Promise(function (resolve, reject) {

    // console.log("-----making getfriends call with----")
    // console.log(" access token: ", oauthAccessToken)
    // console.log(" secret : ", oauthAccessTokenSecret)

    consumer.get(
        "https://api.twitter.com/1.1/friends/list.json?cursor=" + cursor,
        oauthAccessToken,
        oauthAccessTokenSecret,
        function (error, d) {
            let data = JSON.parse(d);
            if (error) {
                const e = JSON.stringify(error)
                console.log("Error getting friends, cursor is: " + cursor + " error: " + e)
                return reject(error);
            } else {
                console.log("-------------GOT DATA BACK --------, number of objects: ", data["total_count"])
                // console.log(data)
                nextcursorstr = data["next_cursor_str"]
                nextcursor = data["next_cursor"]

                // console.log("retrieved " + data.users.length + "friends ")

                return resolve(data);

                // rawFriendsList = rawFriendsList.concact(JSON.parse(data)["users"])
                // console.log(JSON.stringify(rawFriendsList))
            }
        })
    })
}

module.exports = router
