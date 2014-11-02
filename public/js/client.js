
var c,ctx,overlayCtx,overlayc;
var lastPoint;
var clearLastPoint;
var movingBoard = false;
var name;

// Color variables
var colors = ['black','red'];
var colors_borders = ['1px solid rgba(0,0,0,0.4)','1px solid rgba(255,0,0,0.4);'];
var color_selected = 0;

// Check if the user wants to write
var isUserWriting = true;

var radius = 5;
var expansionVar = 1.2;

/*
 *	Client for Socket.IO
 */
 (function($){

	// On form validation send emit the login event to the server
	// It'll create a new user
	$('#loginform').submit(function(event){
		event.preventDefault();
		// Create connection to the socket
		var socket = io.connect('http://172.26.5.118:3000');
		//var socket = io.connect('http://terabites.azurewebsites.net/');

		c = document.getElementById("myCanvas");
		ctx = c.getContext("2d");

		overlayc = document.getElementById("canvasOverlay");
		overlayCtx = overlayc.getContext("2d");


		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', resizeCanvas, false);
		window.addEventListener('resize', resizeOverlayCanvas, false);
		resizeCanvas();
		resizeOverlayCanvas();

		drawCircle(0,0);

		$('.global_container').animate({
		    top: '-100%',
			  }, 2000, function() {
			});
		$('#global_container_1').css('padding','0');

		name = $('#name').val();
		$('#user_info').append(name);
		$('#loginform').remove();
		$('#user_info').fadeIn(2000);
		$('.user_params').fadeIn(2000);
		$('.marquee').marquee({
			duration: 30000,
		});

		/*********************************************************************
		 *					RECEIVING EVENTS & HANDLING THEM
		 *********************************************************************/

		$.get('/users', function(users) {
			for(var i=0; i < users.length; ++i) {
				$('.marquee .js-marquee').append('<span class="user-block" data-id="' + users[i].id + '"><i class="fa fa-circle"></i>' + users[i].name + '</span>');
			}
		});

		socket.on('connect', function(){
			socket.emit('join', name);
		});

		socket.on('joined', function(user){
			$('.marquee .js-marquee').append('<span class="user-block" data-id="' + user.id + '"><i class="fa fa-circle"></i>' + user.name + '</span>');
		});

		socket.on('disconnected', function(id){
			$('*[data-id="' + id + '"]').remove();
		});

		/*
		 *	Manage the user successful connection
		 */
		socket.on('updateDataPoints', function(data){
			// ctx.clearRect(0,0,1000,500);
			ctx.beginPath();
			
			if (lastPoint) {
				ctx.moveTo(lastPoint.x, lastPoint.y);		
				ctx.lineTo(
					data.x * window.innerWidth / expansionVar,
					data.y * window.innerHeight  / expansionVar
				);

			} else {
				ctx.arc( 
					data.x * window.innerWidth / expansionVar,
					data.y * window.innerHeight / expansionVar,
					1, 0, 2 * Math.PI, true);
			}

			lastPoint = {
				x: data.x * window.innerWidth / expansionVar,
				y: data.y * window.innerHeight / expansionVar
			};
			clearInterval(clearLastPoint);

			clearLastPoint = setTimeout(function(){
				lastPoint = null;
			}, 600);

			ctx.stroke();
		});

		/**
		 *	When user is nto writing:
		 *		- showCursor
		 *		- clearOverlay (when done)
		 */
		socket.on('showCursor',function(data){
			drawCircle(data.x, data.y);
		});

		socket.on('clearOverlay', function(){
			// Clear the background
			overlayCtx.clearRect( -(window.innerWidth/2), -(window.innerHeight/2), overlayc.width, overlayc.height);
		})

		/*
		 *	This takes care of toggling the UI element to show if the user
		 * 	has the handle on the pen or not.
		 */
		socket.on('toggleWriting', function(writing){
			if (writing){
				$("#writing_enable").css('display','block');
				$("#writing_disable").css('display','none');
			} else {
				$("#writing_enable").css('display','none');
				$("#writing_disable").css('display','block');
			}
		});
	});
})(jQuery);


function getRadianAngle(degreeValue) {
    return degreeValue * Math.PI / 180;
}

function drawCircle(mouseX, mouseY){
  // Clear the background
  overlayCtx.clearRect( -(window.innerWidth/2), -(window.innerHeight/2), overlayc.width, overlayc.height);
  
  // Establish the circle path
  overlayCtx.beginPath();
  overlayCtx.arc(
  	mouseX * window.innerWidth,
  	mouseY * window.innerHeight,
  	radius, 0 , 2 * Math.PI, false);
  
  // Fill the circle
  overlayCtx.fillStyle = '00F0FF';
  overlayCtx.fill();
  
  // Outline (stroke) the circle
  overlayCtx.lineWidth = 4;
  overlayCtx.strokeStyle = 'black';
  overlayCtx.stroke();
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

function resizeOverlayCanvas(){
	overlayc.width = window.innerWidth;
    overlayc.height = window.innerHeight;
    if (ctx) {
    	overlayCtx.lineWidth = 2;
    	overlayCtx.translate(overlayc.width/2, overlayc.height/2);
 		overlayCtx.rotate(getRadianAngle(180));
		overlayCtx.scale(-1, 1);
    }
}



