
/*
 * GET home page.
 */

var io = require('./socketController').emitter;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.csharp = function(req, res) {
  io(req.body);
  res.end();
};

exports.users = function(req, res) {
  //TODO: get users
};