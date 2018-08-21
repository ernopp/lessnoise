var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  
	var followees = ["Bob", "Bobby", "Bobso"]

  res.render('followees', { title: 'Your followees', followees: followees });

  //res.render('index', { title: 'LessNoise');
});

module.exports = router;
