
var c,ctx,overlayCtx,overlayc;
var lastPoint;
var clearLastPoint;
var movingBoard = false;
var name;

// Check if the user wants to write
var isUserWriting = true;

var radius = 5;
var expansionVar = 1.2;

var wasNotWriting = true; 

var wasAlreadyErase = false;

/*
 *	Client for Socket.IO
 */
 (function($){

	// On form validation send emit the login event to the server
	// It'll create a new user
	$('#loginform').submit(function(event){
		event.preventDefault();
		// Create connection to the socket
		var socket = io.connect('http://172.26.9.46:3000');
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
				$('.marquee .js-marquee').append('<span class="user-block" data-id="' + users[i].id + '"><i class="fa fa-circle online_user"></i>' + users[i].name + '</span>');
			}
		});

		socket.on('connect', function(){
			socket.emit('join', name);
		});

		socket.on('joined', function(user){
			$('.marquee .js-marquee').append('<span class="user-block" data-id="' + user.id + '"><i class="fa fa-circle online_user"></i>' + user.name + '</span>');
		});

		socket.on('disconnected', function(id){
			$('*[data-id="' + id + '"]').remove();
		});

		/*
		 *	Manage the board operations
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

		socket.on('erase',function(data){
			$('#user_notfication').html('<i class="fa fa-file-o"></i>');
			$('#user_notfication').attr('class','notification green');

			if(!wasAlreadyErase){
				$('#user_notfication').fadeIn(500)
									  .delay(500)
									  .fadeOut(500);
				wasAlreadyErase = true;
			} 
			ctx.clearRect( -(window.innerWidth/2), -(window.innerHeight/2), c.width, c.height);
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
			wasAlreadyErase = false;
			if (writing){
				$("#writing_enable").css('display','block');
				$("#writing_disable").css('display','none');

				$('#user_notfication').html('<i class="fa fa-check-square"></i>');
				$('#user_notfication').attr('class','notification green');
				if(wasNotWriting){
					$('#user_notfication').fadeIn(500)
										  .delay(500)
										  .fadeOut(500);
					wasNotWriting = false;
				}
			} else {
				$("#writing_enable").css('display','none');
				$("#writing_disable").css('display','block');

				$('#user_notfication').html('<i class="fa fa-check-square"></i>');
				$('#user_notfication').attr('class','notification red');

				if(!wasNotWriting){
					$('#user_notfication').fadeIn(500)
										  .delay(500)
										  .fadeOut(500);
					wasNotWriting = true;
				}
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



