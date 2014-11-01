
/*
 *	Socket controller
 */

module.exports.init = function(httpServer){
	
	var io = require('socket.io').listen(httpServer);

	/*
	 *	Open socket
	 */
	io.sockets.on('connection', function(socket){

		var self = false;
		console.log('New user');

		// TODO: Retrieve History

		/*
		 *	Message received
		 */
		 socket.on('newData', function(msg){

		 	// Way to emit message to all connected clients
		 	io.sockets.emit('newMsg', msg);

		 });


		 socket.on('doneTyping', function(){
		 	socket.broadcast.emit('doneTyping');
		 });

	});
}


