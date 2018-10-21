//utils to deal with friends lists jsons 

var gpi = function getPrettyFriendsList(items){
  var interestingKeys = ["id", "screen_name", "statuses_count", "ln_days_with_account", "ln_average_statuses_per_day"]
  var prettyItemsList = [];

  items.forEach(function(item, index){
    var prettyItem = {};
    // console.log(item)
    interestingKeys.forEach(function(obj, index){
        prettyItem[obj]=item[obj];
      });    
    prettyItemsList.push(prettyItem);
    });

  return prettyItemsList;
};

//takes raw list returned by twitter api and adds lessnoise user info + activity info of each friend returned
var tf = function transformFriendsList(rawFriendsList){
  var transformedFriendsList = [];

  rawFriendsList.forEach(function(item, index, array) {
    var transformedItem = item;
    var nowInMilliSeconds = Date.now();

    transformedItem["ln_id"] = 254809616;
    transformedItem["ln_name"] = "Ernest Oppetit";
    transformedItem["ln_screen_name"] = "ErnOpp";
    transformedItem["ln_date_retrieved"] = nowInMilliSeconds;    

    var createdAtDate = new Date(item["created_at"]);

    var oneDayInMilliSeconds =1000*60*60*24;
    var daysWithAccount = ( nowInMilliSeconds - createdAtDate.getTime() ) / oneDayInMilliSeconds ;    

    transformedItem["ln_days_with_account"] = daysWithAccount;

    var averageStatusesPerDay = transformedItem["statuses_count"] / daysWithAccount;
    transformedItem["ln_average_statuses_per_day"] = averageStatusesPerDay;

    transformedFriendsList.push(transformedItem)
    
  });
  // pti(transformedFriendsList);
  return transformedFriendsList;
};

var isj = function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
      console.log(e)
        return false;
    }
    return true;
}

module.exports  = {transformFriendsList: tf, getPrettyFriendsList: gpi, IsJsonString: isj};