var express = require('express');
var router = express.Router();
var db = require('../database/connection');
var bcrypt = require('bcrypt');

var players = [];
var cnt = 0;
/* GET home page. */

router.get('/', function(req, res, next) {
  if (req.session.user) {
    
 res.io.on('connection', function(socket){
    cnt++;
    if(cnt === 1)
    {
      req.session.turn = "red";
    }
    else
    {
      req.session.turn = "black";
    }
    // players.push({user : req.session.user, turn: AssignColor()});
    // console.log(players);
    console.log("Connection, req session turn je " + req.session.turn);
    socket.on('checkTurn', function(data, callback){
      console.log('Socket (server-side): received message:', data);
      //console.log('connection data:', evData);
      if(req.session.turn === data)
      {
        callback(true);
      }
      else
      {
        callback(false);
      } 
  });
    socket.on('chat message', function(msg){
      res.io.emit('chat message', msg);
    });

    socket.on('move', function (data) {
      res.io.emit('move', data);
    });
  });
  res.render('index', { title: 'Express' });
}
res.redirect('/login');
});





router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});


router.get('/search', function(req, res, next) {
  res.io.on('connection', function (socket) {
    players.push(req.session.user);
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

router.get('/profile', function(req, res, next){
  res.render('profile', req.session.user);
});

module.exports = router;
