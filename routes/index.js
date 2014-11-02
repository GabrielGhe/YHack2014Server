'use strict';

/*
 * GET home page.
 */

var User = require('./../models/user');
var io = require('./socketController').emitter;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.csharp = function(req, res) {
  io(req.body);
  res.end();
};

exports.users = function(req, res) {
  User.find({}, function(err, users) {
    if (!err) {
      res.json(users);
    } else {
      res.json([]);
    }
  })
};