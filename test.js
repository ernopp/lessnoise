let fs = require('fs')
const debug = require('debug')('lessnoise:index')

let utils = require('./utils');

var tf = async function getTestFriends(){

    let promise =  new Promise(function (resolve, reject) {

        //readfile returns a string https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
        fs.readFile(__dirname + '/testdata/users-sept15-3.json', function (err, data) {
            if (err) {
                return reject(error);
            }

            let rawFriendsList = JSON.parse(data)["users"];
            let transformedFriendsList = utils.augmentFriendsList(rawFriendsList);

            let prettyFriendsList = utils.getPrettyFriendsList(transformedFriendsList);

            debug(prettyFriendsList)

            return resolve(prettyFriendsList);
        });
    });

    promise.catch(function(error) {
        console.error(error)
        return reject(error)
    });

    return promise;
}

module.exports  = {getTestFriends: tf};