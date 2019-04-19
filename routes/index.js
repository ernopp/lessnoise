const consumer = require('../twitter-client')
const express = require('express')
const router = express.Router()
const app = require('../app')
const utils = require('../utils')
const test = require('../test')

/* GET home page. */
router.get('/', function (req, res, next) {
    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, async function (error, data, response) {
        if (error) {
            console.log("error verifying creds trying to connect: ", JSON.stringify(error))
            res.render('home', {title: 'LessNoise'})

        } else {

            let loggedInUser = utils.getLoggedInUser(data)

            console.log("----Successfully verified creds----")
            console.log("Twitter user identified  is: " + JSON.stringify((loggedInUser["twitterIdentifier"])))

            // let prettyFriendsList = getFriends(req.session.oauthAccessToken, req.session.oauthAccessTokenSecret)

            let prettyFriendsList = await test.getTestFriends()

            console.log("prettyFriendsList  : " + prettyFriendsList)

            // https://expressjs.com/en/api.html#res.render
            res.render('reccos', {title: 'LessNoise', prettyFriendsList: prettyFriendsList})
        }
    })
})

async function getFriends(accesstoken, accesstokensecret){

    //get friends list
    //https://developer.twitter.com/en/docs/basics/cursoring
    let nextcursor = -1
    let rawFriendsList = []

    while (nextcursor !== 0) {
        console.log("-----nextcursor is ", nextcursor)
        try {
            const twitterResponse = await makeFriendsListCall(
                nextcursor,
                accesstoken,
                accesstokensecret
            )
            nextcursor = twitterResponse["next_cursor"]

            for (let i = 0; i < twitterResponse["users"].length; i++) {
                console.log("adding friend " + twitterResponse["users"][i]["screen_name"])
                rawFriendsList.push(twitterResponse.users[i])
            }
        } catch (err) {
            return next(err)
        }
    }

    console.log("-----Finished cursoring-----")

    console.log("rawFriendsList has size : " , rawFriendsList.length)

    let transformedFriendsList = utils.transformFriendsList(rawFriendsList)
    let prettyFriendsList = utils.getPrettyFriendsList(transformedFriendsList)

    return prettyFriendsList
}

function makeFriendsListCall(cursor, oauthAccessToken, oauthAccessTokenSecret) {
    return new Promise(function (resolve, reject) {

    consumer.get(
        "https://api.twitter.com/1.1/friends/list.json?cursor=" + cursor + "&count=200&skip_status=true&include_user_entities=false",
        oauthAccessToken,
        oauthAccessTokenSecret,
        function (error, d) {
            let data = JSON.parse(d)
            if (error) {
                const e = JSON.stringify(error)
                console.log("Error getting friends, cursor is: " + cursor + " error: " + e)
                return reject(error)
            } else {
                console.log("-------------GOT DATA BACK --------, number of objects: ", data["users"].length)

                return resolve(data)
            }
        })
    })
}

module.exports = router
