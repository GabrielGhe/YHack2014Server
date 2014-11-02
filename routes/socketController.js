'use strict';

/*
 *	Socket controller
 */
var User = require('./../models/user');
var myIO;

module.exports.init = function(httpServer){
	
	var io = require('socket.io').listen(httpServer);
	myIO = io;

	/*
	 *	Open socket
	 */
	io.sockets.on('connection', function(socket){

		var self = false;
		socket.on('join', function(name) {
			socket.name = name;
			console.log('user ' + socket.name + ' has joined with id: ' + socket.id);
			var user = new User({
				id: socket.id,
				name:socket.name
			});
			user.save();
			socket.broadcast.emit('joined', { name:socket.name, id:socket.id});
		});

		socket.on('disconnect', function(){
			console.log('user ' + socket.name + ' has left');
			User.find({ id: socket.id }, function(err, users) {
				for(var i=0; i < users.length; ++i) {
					users[i].remove();
				}
			});
			socket.broadcast.emit('disconnected', socket.id);
		});

	});
};

module.exports.emitter = function(data) {
	if (myIO) {

		var write = isWritingEnabled(data);

		if(data.erase == 'True'){
			myIO.sockets.emit('erase');
		} else {
			
			if(write && data.writing == 'True'){
			myIO.sockets.emit('clearOverlay');
			myIO.sockets.emit('updateDataPoints', {
				x: data.xValue,
				y: data.yValue,
			});
			myIO.sockets.emit('toggleWriting', true);
			}else{
				myIO.sockets.emit('showCursor', {
					x: data.xValue,
					y: data.yValue,
				});
				myIO.sockets.emit('toggleWriting', false);
			}

		}
	}
}

function isWritingEnabled(data){
	var initZ = parseFloat(data.initZ);
	var realZ = parseFloat(data.zValue);

	if(realZ > initZ+0.06)
		return false;
	else 
		return true;
}


