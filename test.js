var fs = require('fs');

//readfile returns a string https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
fs.readFile( __dirname + '/testdata/ernopp_users.json', function (err, data) {
  if (err) {
    throw err; 
  }

  var rawFriendsList = JSON.parse(data)["rawFriendsList"];  
  console.log(rawFriendsList);

  var jsonfriendlist = JSON.parse(rawFriendsList["users"]);
  
  var transformedFriendsList = {};
  var transformedFriend = {};

  // console.log("-----popping -----")
  // console.log(rawFriendsList.pop());
  
  // for (var friend in rawFriendsList) {    
  //   console.log(friend.name);  
  // };

});