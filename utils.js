//utils to deal with friends lists jsons 

const gpi = function getPrettyFriendsListAndInterestingKeys(items) {
    var interestingKeys = ["screen_name", "name", "statuses_count", "ln_days_with_account", "ln_average_statuses_per_day"]
    var prettyItemsList = []

    items.forEach(function (item, index) {
        var prettyItem = {}

        item["ln_average_statuses_per_day"] = parseFloat(item["ln_average_statuses_per_day"]).toFixed(2)
        item["ln_days_with_account"] = parseFloat(item["ln_days_with_account"]).toFixed(0)

        interestingKeys.forEach(function (obj, index) {
            prettyItem[obj] = item[obj]
        })
        prettyItemsList.push(prettyItem)
    })

    return {
        "interesting_keys": interestingKeys,
        "friends": prettyItemsList
    }
}

//takes raw list returned by twitter api and adds lessnoise user info + activity info of each friend returned
const tf = function transformFriendsList(rawFriendsList) {
    var transformedFriendsList = []

    rawFriendsList.forEach(function (item, index, array) {
        var transformedItem = item
        var nowInMilliSeconds = Date.now()

        transformedItem["ln_id"] = 254809616
        transformedItem["ln_name"] = "Ernest Oppetit"
        transformedItem["ln_screen_name"] = "ErnOpp"
        transformedItem["ln_date_retrieved"] = nowInMilliSeconds

        var createdAtDate = new Date(item["created_at"])

        var oneDayInMilliSeconds = 1000 * 60 * 60 * 24
        var daysWithAccount = (nowInMilliSeconds - createdAtDate.getTime()) / oneDayInMilliSeconds

        transformedItem["ln_days_with_account"] = daysWithAccount

        var averageStatusesPerDay = transformedItem["statuses_count"] / daysWithAccount
        transformedItem["ln_average_statuses_per_day"] = averageStatusesPerDay

        transformedFriendsList.push(transformedItem)

    })
    // pti(transformedFriendsList);
    return transformedFriendsList
}

const gliu = function getLoggedInUser(data){

    //save the logged in user's info in twitterIdentifier json object. used later to identify their friends in the database
    let verifyCredentialsData = JSON.parse(data)
    let loggedInUser = {
        id: verifyCredentialsData["id"],
        name: verifyCredentialsData["name"],
        screen_name: verifyCredentialsData["screen_name"]
    }

    return loggedInUser;
}

const isj = function IsJsonString(str) {
    try {
        JSON.parse(str)
    } catch (e) {
        console.log(e)
        return false
    }
    return true
}

module.exports  = {transformFriendsList: tf, getPrettyFriendsList: gpi, getLoggedInUser: gliu};