const consumer = require('../twitter-client')
const express = require('express')
const router = express.Router()
const app = require('../app')
const debug = require('debug')('lessnoise:index')
const utils = require('../utils')
const test = require('../test')

/* GET home page. */
router.get('/', function (req, res, next) {

    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, async function (error, data, response) {
        if (error) {
            debug("error verifying creds trying to connect: ", JSON.stringify(error))
            res.render('home', {title: '🙏 LessNoise'})

        } else {
            try{
                let loggedInUser = utils.getLoggedInUser(data)

                debug("----Successfully verified creds----")
                debug("Twitter user identified  is: " + JSON.stringify((loggedInUser["twitterIdentifier"])))

                let prettyFriendsList = (process.env.USETESTDATA === "true")
                    ? await test.getTestFriends() : await getFriends(req.session.oauthAccessToken, req.session.oauthAccessTokenSecret)

                if(!prettyFriendsList.error){
                    res.render('reccos', {title: '🙏 LessNoise', loggedInUser: loggedInUser, prettyFriendsList: prettyFriendsList.data, baseURL: utils.baseURL})
                }
                else{
                    debug("throwing rate limiting error: " + JSON.stringify(prettyFriendsList.error))

                    let e = new Error("Sorry, you've been rate-limited by the Twitter API. Please try again in 15 mins (just reload this page)")
                    e.status = 419
                    next(e)
                }
            }
            catch (err) {
                next(err)
            }
        }
    })
})

/*
    Can do 15 requests per 15min
    window https://developer.twitter.com/en/docs/basics/rate-limiting.html
    Use count=200 to get max friends in friends list call https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-friends-list.html
 */

async function getFriends(accesstoken, accesstokensecret) {

    let nextcursor = -1
    let rawFriendsList = []
    let callCount = 0
    let prettyFriendsList = []

    debug("New invocation of getFriends")

    try {
        // cap at 1000 recommendations - 5 calls of 200 each
        while (nextcursor !== 0 && callCount <= 4) {
            debug("-----cursoring: callcount is ", callCount)
            debug("-----rawfriendslist has size ", rawFriendsList.length)
            const twitterResponse = await makeFriendsListCall(
                nextcursor,
                accesstoken,
                accesstokensecret
            )
            nextcursor = twitterResponse["next_cursor"]
            callCount++

            for (let i = 0; i < twitterResponse["users"].length; i++) {
                // debug("adding friend " + twitterResponse["users"][i]["screen_name"])
                rawFriendsList.push(twitterResponse.users[i])
            }
        }
    }
    catch (err){
        debug("throwing error in getFriends: " + JSON.stringify(err))
        prettyFriendsList.error = err
    }

    debug("-----Finished cursoring-----")

    debug("rawFriendsList has size : ", rawFriendsList.length)

    let augmentedFriendsList = utils.augmentFriendsList(rawFriendsList)
    prettyFriendsList.data = utils.getPrettyFriendsList(augmentedFriendsList)

    debug("Finished invocation of getFriends")

    return prettyFriendsList
}

function makeFriendsListCall(cursor, oauthAccessToken, oauthAccessTokenSecret) {
    let promise = new Promise(function (resolve, reject) {

        consumer.get(
            "https://api.twitter.com/1.1/friends/list.json?cursor=" + cursor + "&count=200&skip_status=true&include_user_entities=false",
            oauthAccessToken,
            oauthAccessTokenSecret,
            function (error, d, response) {

                debug("response headers from friedns list call: " +JSON.stringify(response.headers))
                let data = JSON.parse(d)
                if (error) {
                    const e = JSON.stringify(error)
                    debug("Error getting friends, cursor is: " + cursor + " error: " + e)
                    return reject(error)
                } else {
                    debug("-------------GOT DATA BACK --------, number of objects: ", data["users"].length)

                    return resolve(data)
                }
            })
    })

    debug("contents promise are " +JSON.stringify(promise))
    return promise
}

module.exports = router
