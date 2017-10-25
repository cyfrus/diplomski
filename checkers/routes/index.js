var express = require('express');
var router = express.Router();
var db = require('../database/connection');
var bcrypt = require('bcrypt');


var cnt = 0;
var turn = "red";

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {

    res.io.on('connection', function (socket) {
      req.session.turn = turn;
      turn = turn === "red" ? "black" : "red";
      console.log("connection!!");
      console.log("Connection, req session turn je " + req.session.turn);
      socket.on('checkTurn', function (data, callback) {
        console.log('Socket (server-side): received message:', data);
        //console.log('connection data:', evData);
        if (req.session.turn === data.turn && req.session.turn === data.selected) {
          callback(true);
        }
        else {
          callback(false);
        }
      });

      socket.on('chat message', function (msg) {
        res.io.emit('chat message', msg);
      });

      socket.on('move', function (data) {
        res.io.emit('move', data);
      });

      socket.on('disconnect', function () {
        res.io.emit('user disconnected');
      });
    });


    res.render('index', { title: 'Express' });
  }
  else {
    res.redirect('/login');
  }

});

router.get('/welcome', function (req, res, next) {
  res.render('welcome', { title: 'Express' });
});

router.get('/search', function (req, res, next) {
  if (req.session.user) {
    res.io.on('connection', function (socket) { 
      socket.on('search', function (data) {
       
      });
    });
    db.getSearch(function (data) {
      console.log(data)
      res.render('search', { searching: req.session.searching, data: data });
    });
  }

});

router.post('/find', function (req, res, next) {
  db.search(req.session.user.id, req.session.user.mmr, req.body.seconds);
  req.session.searching = true;
  res.redirect('search');
})

router.post('/stop', function (req, res, next) {
  console.log(req.session.user.id);
  db.stop(req.session.user.id);
  req.session.searching = false;
  res.redirect('search');
})

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

router.get('/profile', function (req, res, next) {
  res.render('profile', req.session.user);
});

module.exports = router;
