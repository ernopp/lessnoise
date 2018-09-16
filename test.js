var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/lessnoise'


//readfile returns a string https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
fs.readFile( __dirname + '/testdata/users-sept15-3.json', function (err, data) {
  if (err) {
    throw err; 
  }

  var rawFriendsList = JSON.parse(data)["users"];    
  var transformedFriendsList = transformFriendsList(rawFriendsList);

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db){
    if(err){
      throw err;
    }
    console.log("Connected");      

    var dbo = db.db("lessnoise");

    dbo.collection("users").insertMany(transformedFriendsList, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });

    var sort = {ln_average_statuses_per_day  : -1};

    dbo.collection("users").find({}).sort(sort).toArray(function(err, result) {
    if (err) throw err;
    console.log(printTransformedItems(result))
    // console.log(result);

    db.close();
    });
  });
});

function transformFriendsList(rawFriendsList){
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
  printTransformedItems(transformedFriendsList);
  return transformedFriendsList;
};

function printTransformedItems(items){
  var interestingKeys = ["id", "screen_name", "statuses_count", "ln_days_with_account", "ln_average_statuses_per_day"]
  // "ln_id", "ln_name", "ln_screen_name", 

  items.forEach(function(item, index){
    // console.log(item)
    interestingKeys.forEach(function(obj, index){
        console.log(obj, item[obj]);
      });
    console.log("--------------------------")
    });
};

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
      console.log(e)
        return false;
    }
    return true;
}