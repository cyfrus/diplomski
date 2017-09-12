var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});

var players = [];
router.get('/search', function(req, res, next) {
  res.io.on('connection', function (socket) {
    socket.on('my other event', function (data) {
      console.log(data);
    });
  
  });
  res.render('search', { title: 'Express' });
});

module.exports = router;
