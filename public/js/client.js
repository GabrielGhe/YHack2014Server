

/*
 *	Client for Socket.IO
 */
 (function($){

	// Create connection to the socket
	var socket    = io.connect('http://localhost:1337');

	// On form validation send emit the login event to the server
	// It'll create a new user
	$('#loginform').submit(function(event){
		event.preventDefault();

		// Proceed only if the username is not taken
		if(!userTaken){

			socket.emit('login', {
				username: $('#username').val(),
				mail	: $('#mail').val()
			});

		}		

	});


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
