
/*
 *	Socket controller
 */


module.exports.init = function(httpServer){
	
	var io = require('socket.io').listen(httpServer);


	// Test variables
	var X = 0;
	var Y = 0;

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
		 socket.on('newData', function(x,y){
		 	// Way to emit message to all connected clients
		 	// io.sockets.emit('newMsg', msg);
		 	socket.broadcast.emit('test',x,y);
		 });


		 // The following code will be placed in the onDataReceive function
		 // when the data is transfered from the C# server to here.
		 setInterval(function(){
		 	 X += 50;
		 	 Y += 10;

			 socket.broadcast.emit('updateDataPoints', {
		 		x:X%1000,
		 		y:Y%500
			 });

			 console.log('Sending data');
		 },5);



		 socket.on('doneTyping', function(){
		 	socket.broadcast.emit('doneTyping');
		 });

	});
}


