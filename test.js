var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/lessnoise'

var utils = require('./utils');

//readfile returns a string https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
fs.readFile( __dirname + '/testdata/users-sept15-3.json', function (err, data) {
  if (err) {
    throw err; 
  }

  var rawFriendsList = JSON.parse(data)["users"];    
  var transformedFriendsList = utils.transformFriendsList(rawFriendsList);

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