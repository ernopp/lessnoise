//Routes oauth flow connect and callback

const consumer = require('../twitter-client')
const express = require('express')
const router = express.Router()

router.get('/', async function (req, res) {
    let userId = req.query["userIds"]
    console.log("unfollow page hit with user ids " + userId)
    // res.send("received userIds " + req.query["userIds"])

    let destroyedFriend = await destroyFriends("376589964", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret)

    res.send("outcome of destroyfriend is " + destroyedFriend + " to string " + destroyedFriend.toString())

    // res.redirect('/')

})

// 376589964
// asalamunovic

async function destroyFriends(userIds, accesstoken, accesstokensecret){
    let destroyedFriend = {}
    try{
        console.log("calling makeDestroyFriendshipCall")
        destroyedFriend = await makeDestroyFriendshipCall(userIds, accesstoken, accesstokensecret)
    } catch (err) {
        return next(err)
    }

    return destroyedFriend;
}

function makeDestroyFriendshipCall(screen_name, oauthAccessToken, oauthAccessTokenSecret) {
    return new Promise(function (resolve, reject) {

        // https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/post-friendships-destroy.html
        // returns
        // https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object

        console.log("calling api destroy endpoint")

        consumer.post(
            "https://api.twitter.com/1.1/friendships/destroy.json?screen_name=" + screen_name,
            oauthAccessToken,
            oauthAccessTokenSecret,
            function (error, d) {
                let data = JSON.parse(d)
                if (error) {
                    const e = JSON.stringify(error)
                    console.log("Error destroying friendships: " + e)
                    return reject(error)
                } else {
                    console.log("Destroyed friendship. User destroyed has" +
                        " id:" + data["id"] + " and username: " + data["screen_name"])
                    return resolve(data)
                }
            })
    })
}

module.exports = router