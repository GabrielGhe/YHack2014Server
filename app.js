
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var user = require('./routes/socketController');
var http = require('http');
var path = require('path');

//-------------------------------------------
// mongoose
var mongoose = require('mongoose');
if (process.env.NODE_ENV === 'production') {

} else {
    mongoose.connect('mongodb://localhost/whiteboard');
}
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

var app = express();

// -------------------------------------------
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/csharp', routes.csharp);
app.get('/users', routes.users);

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

require('./routes/socketController').init(httpServer);
