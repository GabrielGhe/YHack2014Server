

/*
 *	Client for Socket.IO
 */
 (function($){

	// Create connection to the socket
	var socket = io.connect('http://terabites.azurewebsites.net/');

	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	// On form validation send emit the login event to the server
	// It'll create a new user
	$('#loginform').submit(function(event){
		event.preventDefault();

		$('.global_container').animate({
		    top: '-100%',
			  }, 2000, function() {
			});
		$('#global_container_1').css('padding','0');
		
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

		/*
	 *	Manage the user successful connection
	 */
	socket.on('test', function(x){
		console.log('('+x+')');
	});

})(jQuery);
