
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.csharp = function(req, res){
  console.log("yataaa");
  res.end();
};