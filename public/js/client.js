

/*
 *	Client for Socket.IO
 */
 (function($){

	// Create connection to the socket
	var socket = io.connect('http://172.26.5.118:3000');

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
	socket.on('updateDataPoints', function(data){
		// ctx.clearRect(0,0,1000,500);

		ctx.beginPath();
		
		console.log("context height", c.height);
		console.log("context width", c.width);
		
		ctx.arc( 
			1000 - (data.x*100) + 500,
			500 - (data.y*100) + 250, 
			2, 0, 2 * Math.PI, true);

		// ctx.fillRect(
		// 	(data.x*100) + 500,
		// 	(data.y*100) + 250,
		// 	10,
		// 	10
		// );

		ctx.stroke();
	});


})(jQuery);
