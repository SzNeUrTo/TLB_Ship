var PYHTON_HOST = '127.0.0.1'
var PYTHON_PORT = 8081
var SOCKETIO_PORT = 8080
var viewers = []
var players = []
var screenWidth = 800;
var screenHeight = 600;
var shipSize = 70;
var shipSpeed = 5;

var gameStart = false;
var gameRemainingTime = 120;
var player = {
	sid : '5600000000',
	lifepoint : 3,
	score : 0,
	x : 0,
	y : 0,
	angle : 0,
	checkVal : '',
	shooting : false,
	turnship : false
}
var bulletSpeed = 20;

var io = require('socket.io').listen(SOCKETIO_PORT);

// use for simuserver.html
//io.sockets.on('connection', function(socket) {
//	io.sockets.emit('menu', {pizza: 'Hawaiian pizza'});
//
//	socket.on('order', function(pizza) {
//		console.log('You want to order menu ', pizza);
//	});
//	
//	socket.on('disconnect', function() {
//		io.sockets.emit('end call');
//	});
//});  

var net = require('net');  // node v0.10.21 (latest)

net.createServer(function(socket) {
	mySocket = socket
    console.log('CONNECTION for Python: ' + socket.remoteAddress +':'+ socket.remotePort);

	console.log('=================== Game is Started... ======================');
	var body = '';
	socket.on('data', function(data) {
		data = data + '';
		cmd = data.split('|')[0];
		data = data.split('|');
		if (cmd == 'GameStart') {
			console.log('GM CMD = GameStart');
			gameStart = true;
		}
		else if (cmd  == 'JoinGame' && !gameStart) {
			IP = data[1] + '';
			ID = data[2] + '';
			CheckVal = data[3] + '';
			console.log('Join Game :' + IP + ' ' + ID + ' ' + CheckVal);
			index = 'IP' + IP + ID + CheckVal;
			if (players[index] == null) {
				players[index] = player;
				players[index].sid = ID;
				players[index].LP = 3;
				players[index].score = 0;
				players[index].x = 200;
				players[index].y = 200;
				players[index].angle = 0;
				players[index].checkVal = CheckVal;
				players[index].shooting = false;
				players[index].turnship = false;
			}
		}
		else if (gameStart && cmd == 'ShootingToggle') {
			//player shooting true
			index = 'IP' + IP + ID + CheckVal;
			players[index].shooting = !players[index].shooting;
			console.log('shooting');
		}
		else if (gameStart && cmd == 'TurnShip') {
			index = 'IP' + IP + ID + CheckVal;
			players[index].turnship = !players[index].turnship;
			console.log('TurnShip ' + socket.remoteAddress);
		}
	    console.log('DATA ' + socket.remoteAddress + ' eiei : ' + data);
	    body += data;
		io.sockets.emit('menu', {pizza: (data+'')});
	});

    socket.on('close', function(err) {
        console.log('finish transmitting data... ');
        console.log(body);
    });
}).listen(PYTHON_PORT, PYHTON_HOST, function() {
    console.log('----> socket to talk to python ' + PYHTON_HOST + ':' + PYTHON_PORT);
});
