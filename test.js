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
    else{

      console.log("Connected");      
    }
    // console.log("db", db)
    var dbo = db.db("lessnoise");

    // dbo.collection("users").findOne({}, function(err, result) {
    //   if (err) throw err;
    //   console.log(result);
    //   db.close();
    // });

    dbo.collection("users").insertMany(transformedFriendsList, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });

  });
});

function transformFriendsList(rawFriendsList){
  var transformedFriendsList = [];

  rawFriendsList.forEach(function(item, index, array) {
    var transformedItem = item;
    transformedItem["follower_id"] = "ernopp";
    transformedItem["date_retrieved"] = Date.now();
    transformedFriendsList.push(transformedItem)
    // console.log(item["screen_name"], index);
    // console.log(transformedItem);
    // console.log(IsJsonString(JSON.stringify(transformedItem)));
  });

  return transformedFriendsList;
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
      console.log(e)
        return false;
    }
    return true;
}