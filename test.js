let fs = require('fs')
let MongoClient = require('mongodb').MongoClient
let  url = 'mongodb://localhost/lessnoise'

let utils = require('./utils');

var tf = async function getTestFriends(){

    return new Promise(function (resolve, reject) {

        //readfile returns a string https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
        fs.readFile(__dirname + '/testdata/users-sept15-3.json', function (err, data) {
            if (err) {
                return reject(error);
            }

            // console.log(data.toString("utf-8"))

            let rawFriendsList = JSON.parse(data)["users"];
            let transformedFriendsList = utils.transformFriendsList(rawFriendsList);

            let prettyFriendsList = utils.getPrettyFriendsList(transformedFriendsList);

            console.log(prettyFriendsList)

            return resolve(prettyFriendsList);
        });
    });
}

module.exports  = {getTestFriends: tf};

// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db){
//   if(err){
//     throw err;
//   }
//   console.log("Connected");
//
//   var dbo = db.db("lessnoise");
//
//   dbo.collection("users").insertMany(transformedFriendsList, function(err, res) {
//     if (err) throw err;
//     console.log("Number of documents inserted: " + res.insertedCount);
//     db.close();
//   });
//
//   var sort = {ln_average_statuses_per_day  : -1};
//
//   dbo.collection("users").find({}).sort(sort).toArray(function(err, result) {
//   if (err) throw err;
//   console.log(printTransformedItems(result))
//   // console.log(result);
//
//   db.close();
//   });
// });