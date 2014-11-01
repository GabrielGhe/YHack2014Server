
/*
 * GET home page.
 */

var io = require('./socketController').emitter;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.csharp = function(req, res) {
  console.log("xvalue", req.body.xValue);
  io(req.body);
  res.end();
};