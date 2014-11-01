
/*
 *	Socket controller
 */
var myIO;

module.exports.init = function(httpServer){
	
	var io = require('socket.io').listen(httpServer);
	myIO = io;

	// Test variables
	var X = 0;
	var Y = 0;

	/*
	 *	Open socket
	 */
	io.sockets.on('connection', function(socket){

		var self = false;
		console.log('New user');

	});
};

module.exports.emitter = function(data) {
	if (myIO) {

		var write = isWritingEnabled(data);

		if(data.moveBoard == 'True'){
			myIO.sockets.emit('moveBoard', {
				x: data.moveBoardX,
				y: data.moveBoardY
			})
		}else {
			if(write && data.writing == 'True'){
			myIO.sockets.emit('clearOverlay');
			myIO.sockets.emit('updateDataPoints', {
				x: data.xValue,
				y: data.yValue,
			});
			myIO.sockets.emit('toggleWriting', true);
			}else{
				myIO.sockets.emit('showCursor', {
					x: data.xValue,
					y: data.yValue,
				});
				myIO.sockets.emit('toggleWriting', false);
			}
		}
	}
}

function isWritingEnabled(data){
	var initZ = parseFloat(data.initZ);
	var realZ = parseFloat(data.zValue);

	if(realZ > initZ+0.06)
		return false;
	else 
		return true;
}


