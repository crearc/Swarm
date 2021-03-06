'use strict';
var PlayerSchema = require('../models/player'),
    mongoose = require('mongoose');

/**
 * Standard success json response with the passed in object
 * @param  {Response Object} res
 * @param  {String} uname
 */
var success = function (res, obj) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(obj));
  res.end();
};


/**
 * Standard error response with the passed in error string
 * @param  {Response Object} res
 * @param  {String} errorString
 */
var error = function (res, errorString) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ error: errorString }));
  res.end();
};

// Login Route
exports.login = function (req, res, next) {
  var uname = req.body.uname,
      pwd = req.body.pwd,
      db = mongoose.createConnection(process.env.SWARM_DB_URL),
      collectionName = process.env.NODE_ENV === 'test' ? 'TestPlayer' : 'Player',
      Player = db.model(collectionName, PlayerSchema);

  if (uname && pwd) {
    Player.findByUsername(uname, function (err, player) {
      if (err) {
        return next(err);
      }

      if (player) {
        if (player.authenticate(pwd)) {
          req.session.loggedin = true;
          req.session.uname = uname;
          req.session.stats = player.stats;
          req.session.stats.wins = req.session.stats.wins || 0;
          req.session.stats.loses = req.session.stats.loses || 0;
          success(res, {'uname': uname});
        }
        else {
          error(res, 'Incorrect password');
        }
      }
      else {
        error(res, 'No such username');
      }
      db.close();
    });
  }
  else {
    error(res, 'Invalid params');
    db.close();
  }
};

// Register route
exports.register = function (req, res, next) {
  var uname = req.body.uname,
      pwd = req.body.pwd,
      db = mongoose.createConnection(process.env.SWARM_DB_URL),
      collectionName = process.env.NODE_ENV === 'test' ? 'TestPlayer' : 'Player',
      Player = db.model(collectionName, PlayerSchema);

  if (uname && pwd) {
    Player.usernameExists(uname, function (err, exists) {
      if (err) {
        return next(err);
      }

      if (exists) {
        error(res, 'Username already exists');
        db.close();
      }
      else {
        var player = new Player();
        player.username = uname;
        player.password = pwd;
        player.save(function () {
          req.session.loggedin = true;
          req.session.uname = uname;
          req.session.stats = {
            wins: 0,
            loses: 0
          };
          success(res, {'uname': uname});
          db.close();
        });
      }
    });
  }
  else {
    error(res, 'Invalid params');
    db.close();
  }
};

// Logout route
exports.logout = function (req, res) {
  req.session.loggedin = false;
  req.session.uname = null;
  res.redirect('/');
};

// Home page route
exports.home = function (req, res) {
  if (!req.session.loggedin) {
    res.redirect('/');
  }
  else {
    res.render('home', {
      uname: req.session.uname,
      stats: req.session.stats
    });
  }
};
