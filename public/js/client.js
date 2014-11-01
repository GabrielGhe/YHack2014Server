

/*
 *	Client for Socket.IO
 */
 (function($){

	// Create connection to the socket
	var socket    = io.connect('http://localhost:1337');

	/*	Way to send messages to server	

		socket.emit('login', {
			username: $('#username').val(),
			mail	: $('#mail').val()
		});
	*/



	/*********************************************************************
	 *					SENDING EVENTS TO THE SERVER
	 *********************************************************************/
	/*
	 *	Manage the message sending
	 */
	 $('#send...').submit(function(event){
	 	// TODO
	 });


	/*********************************************************************
	 *					RECEIVING EVENTS & HANDLING THEM
	 *********************************************************************/

	/*
	 *	Manage the user successful connection
	 */
	socket.on('logged', function(user){
		self = user 
	});

	/*
	 *	Manage the message receiving
	 */
	 socket.on('newInput', function(msg){
	 	// TODO
	 });

	/*
	 *	Manage the user connection
	 */
	socket.on('newUser', function(user){
		// TODO
	});

	/*
	 *	Manage the user disconnection
	 */
	socket.on('delUser', function(user){
		// TODO
	});



	/*********************************************************************
	 *					USER EVENTS (KEYPRESS,KEYUP,KEY DOWN)
	 *********************************************************************/


})(jQuery);
