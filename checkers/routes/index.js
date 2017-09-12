var express = require('express');
var router = express.Router();
var db = require('../database/connection');
var bcrypt = require('bcrypt');

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
    players.push(req.session.user);
    // console.log(req.session.user);
    console.log(players);
    socket.on('my other event', function (data) {
    });
  
  });
  res.render('search', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/welcome');
  }
  res.render('login');
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    // cannot access session here 
    res.redirect('/login');
  });
});

router.post('/authenticate', function (req, res, next) {

  db.authenticate(req.body.username, req.body.password, function (authenticated, user, error) {
    console.log(req.body.username +  " " + req.body.password);

    if (authenticated === true) {
      req.session.user = user;
      res.redirect('/welcome');
    }
    else {

      res.redirect('/login');
    }
  });
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', function (req, res, next) {
  db.register(req.body.name, req.body.surname, req.body.username, req.body.age, req.body.password);
  res.redirect('/login');
});


module.exports = router;
