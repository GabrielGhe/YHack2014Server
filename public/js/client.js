

/*
 *	Client for Socket.IO
 */
 (function($){

	// Create connection to the socket
	var socket = io.connect('http://terabites.azurewebsites.net:3000');


	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	// On form validation send emit the login event to the server
	// It'll create a new user
	$('#loginform').submit(function(event){
		event.preventDefault();

		$('.global_container').animate({
		    top: '-115%',
			  }, 2000, function() {
			});
		
	});


	/*********************************************************************
	 *					RECEIVING EVENTS & HANDLING THEM
	 *********************************************************************/

	/*
	 *	Manage the user successful connection
	 */
	socket.on('updateDataPoints', function(wrapper){
		ctx.clearRect(0,0,1000,500);

		ctx.beginPath();
		ctx.moveTo(wrapper.x, wrapper.y);
		ctx.lineTo(1000,500);

		ctx.stroke();
	});


})(jQuery);
