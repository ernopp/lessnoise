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

                // let prettyFriendsList = await getFriends(req.session.oauthAccessToken, req.session.oauthAccessTokenSecret)

                let prettyFriendsList = await test.getTestFriends()

                debug("prettyFriendsList  : " + prettyFriendsList)

                res.render('reccos', {title: '🙏 LessNoise', loggedInUser: loggedInUser, prettyFriendsList: prettyFriendsList, baseURL: utils.baseURL})
            }
            catch (err) {
                return next(err)
            }

        }
    })
})

router.get('/test-cookie', function(req, res) {
    if (req.session.page_views) {
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
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

    // cap at 1000 recommendations - 5 calls of 200 each
    while (nextcursor !== 0 && callCount <= 4) {
        debug("-----callcount is ", callCount)
        debug("-----nextcursor is ", nextcursor)
        debug("-----rawfriendslist has size ", rawFriendsList.length)
        try {
            const twitterResponse = await makeFriendsListCall(
                nextcursor,
                accesstoken,
                accesstokensecret
            )
            nextcursor = twitterResponse["next_cursor"]
            callCount++

            for (let i = 0; i < twitterResponse["users"].length; i++) {
                debug("adding friend " + twitterResponse["users"][i]["screen_name"])
                rawFriendsList.push(twitterResponse.users[i])
            }
        } catch (err) {
            return next(err)
        }
    }

    debug("-----Finished cursoring-----")

    debug("-----callcount is ", callCount)
    debug("rawFriendsList has size : ", rawFriendsList.length)

    let augmentedFriendsList = utils.augmentFriendsList(rawFriendsList)
    let prettyFriendsList = utils.getPrettyFriendsList(augmentedFriendsList)

    return prettyFriendsList
}

function makeFriendsListCall(cursor, oauthAccessToken, oauthAccessTokenSecret) {
    let promise = new Promise(function (resolve, reject) {

        consumer.get(
            "https://api.twitter.com/1.1/friends/list.json?cursor=" + cursor + "&count=200&skip_status=true&include_user_entities=false",
            oauthAccessToken,
            oauthAccessTokenSecret,
            function (error, d) {
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

    promise.catch(function(error) {
        console.error(error)
        return reject(error)
    });


    return promise;
}

module.exports = router
