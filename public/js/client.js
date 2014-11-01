

/*
 *	Client for Socket.IO
 */
 (function($){

	// Create connection to the socket
	var socket = io.connect('http://localhost:3000');


	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

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
