
var c,ctx;
var lastPoint;

// Color variables
var colors = ['black','red'];
var colors_borders = ['1px solid rgba(0,0,0,0.4)','1px solid rgba(255,0,0,0.4);'];
var color_selected = 0;

// Check if the user wants to write
var isUserWriting = true;

/*
 *	Client for Socket.IO
 */
 (function($){

	// Create connection to the socket
	var socket = io.connect('http://172.26.5.118:3000');

	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

	// resize the canvas to fill browser window dynamically
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();

	// On form validation send emit the login event to the server
	// It'll create a new user
	$('#loginform').submit(function(event){
		event.preventDefault();

		$('.global_container').animate({
		    top: '-100%',
			  }, 2000, function() {
			});
		$('#global_container_1').css('padding','0');

		$('#user_info').append($('#name').val());
		$('#loginform').remove();
		$('#user_info').fadeIn(2000);
		$('.user_params').fadeIn(2000);
		
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
		
		if (lastPoint) {
			ctx.moveTo(lastPoint.x, lastPoint.y);		
			ctx.lineTo(
				data.x * window.innerWidth, 
				data.y * window.innerHeight
			);

		} else {
			lastPoint = null;
			ctx.arc( 
				data.x * window.innerWidth,
				data.y * window.innerHeight, 
				1, 0, 2 * Math.PI, true);
		}

		lastPoint = {
			x: data.x * window.innerWidth,
			y: data.y * window.innerHeight
		};

		ctx.save();
		if (writing) {
			ctx.strokeStyle = "#rgba(255,255,255,0.5)";
		}
		ctx.arc( 
			data.x * window.innerWidth,
			data.y * window.innerHeight, 
			2, 0, 2 * Math.PI, true);
		ctx.restore();

		ctx.stroke();
	});

	socket.on('toggleWriting', function(writing){
		console.log(writing);
		if (writing){
			$("#writing_enable").css('display','block');
			$("#writing_disable").css('display','none');
		} else {
			$("#writing_enable").css('display','none');
			$("#writing_disable").css('display','block');
		}
	});


})(jQuery);


function getRadianAngle(degreeValue) {
    return degreeValue * Math.PI / 180;
} 

function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    if (ctx) {
    	ctx.lineWidth = 2;
    	ctx.translate(c.width/2, c.height/2);
	 		ctx.rotate(getRadianAngle(180));
			ctx.scale(-1, 1);
    }
}