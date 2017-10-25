
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var session = require('express-session')

const saltRounds = 10;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'checkers'
});

connection.connect();

module.exports = {
    register: function (name, surname, username, age, password) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                // Store hash in your password DB. 
                connection.query('INSERT INTO users SET ?', { name: name, surname: surname, username:  username, age: age, password: hash }, function (error, results, fields) {
                    if (error) throw error;

                });
            });
        });
    },
    authenticate: function (username, password, result) {
        connection.query('SELECT * FROM users WHERE username=' + connection.escape(username), function (error, results, fields) {
            // error will be an Error if one occurred during the query 
            // results will contain the results of the query 
            // fields will contain information about the returned results fields (if any)
            if (error) throw error;
            bcrypt.compare(password, results[0].password, function (err, res) {
                result(res,results[0],null);
            });
        });
    },

    search: function(player_id, mmr, seconds)
    {
        connection.query('INSERT INTO search SET ?', {player_id: player_id, mmr: mmr, seconds: seconds}, function(error, results, fields){
            if (error) throw error;
        });
    },

    stop: function(id)
    {
        connection.query('DELETE FROM search WHERE player_id =' + id, function (error, results, fields){
        });
    },

    getSearch: function(callback)
    {
       
        connection.query('SELECT * from search INNER JOIN users ON search.player_id = users.id', function(error, results, fields){
            return callback(results);
        });
        
    }

}