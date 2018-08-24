var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // var followees = ["Bob", "Bobby", "Bobso"]
  // res.render('followees', { title: 'Your followees', followees: followees });

  // https://expressjs.com/en/api.html#res.render
  res.render('index', {title: 'LessNoise'});
});

module.exports = router;
