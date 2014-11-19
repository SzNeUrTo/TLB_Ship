var PYHTON_HOST = '127.0.0.1'
var PYTHON_PORT = 8081
var SOCKETIO_PORT = 8080
var viewers = []
var players = []
var bullets = []
var remover = []
var screenWidth = 800;
var screenHeight = 600;
var shipSize = 70;
var bulletSize = 5;
var bulletSpeed = 20;
var shipRunSpeed = 5;
var shipTurnSpeed = 5;
var gameStart = false;
var gameEnd = false;
var gameRemainingTime = 180;
var players_index = [];
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

var bullet = {
	x : 0,
	y : 0,
	angle : 0,
	owner : 'indexofplayers'
};

var isNot_initPosition = false;
var isLetGo = false;
// ---------------------------- server ---------------------------------------------
var io = require('socket.io').listen(SOCKETIO_PORT);
io.sockets.on('connection', function(socket) {
	viewers[viewers.length] = socket.id;
	console.log('Viewer Connection ID : ' + socket.id);
});

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
		else if (cmd == 'PrepareToStart') {
			console.log('Close to join game...');
		}
		else if (cmd == 'LetGo') {
			console.log('Fighting');
			isLetGo = true;
		}
		else if (cmd  == 'JoinGame' && !gameStart) {
			ID = data[1] + '';
			CheckVal = data[2] + '';
			console.log('Join Game :' + socket.remoteAddress + ' ' + ID + ' ' + CheckVal);
			index = socket.remoteAddress + data[1] + data[2] + data[3];
			players_index[players_index.length] = index;
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
			index = socket.remoteAddress + data[1] + data[2] + data[3];
			players[index].shooting = !players[index].shooting;
			console.log('shooting');
		}
		else if (gameStart && cmd == 'TurnShipToggle') {
			index = socket.remoteAddress + data[1] + data[2] + data[3];
			players[index].turnship = !players[index].turnship;
			console.log('TurnShip ' + socket.remoteAddress);
		}
	    console.log('IP : ' + socket.remoteAddress + ' DATA_Recieve : ' + data);
	});

    socket.on('close', function(err) {
        console.log('Disconnect');
    });

}).listen(PYTHON_PORT, PYHTON_HOST, function() {
    console.log('----> Socket to talk to python !!!!!!!   Host : ' + PYHTON_HOST + ': PORT : ' + PYTHON_PORT + '   !!!!!!!!');
});
//----------------------------  Game -------------------------------------------------
function initPlayerPositionAndAngle() {
	for (var i = 0; i < players_index.length; i++) {
		if (isNot_initPosition) {
			players[players_index[i]].x = screenWidth * i / size + shipSize;
			players[players_index[i]].y = screenHeight * i / size + shipSize;
			players[players_index[i]].angle = Math.floor((Math.random() * 360));
		}
		isNot_initPosition = true;
	}
	console.log('initPlayerPositionAndAngle');
}

function sendDataPlayerToClient(cmd) {
	for (var i=0; i<viewers.length; i++) {
		io.sockets.socket(viewers[i]).emit(cmd, players);
	}
}

function updateTimer() {
	if (LetGo) {
		for (var i=0; i<viewers.length; i++) {
			io.sockets.socket(viewers[i]).emit('updateTimer', gameRemainingTime--);
		}
	}
}

function updatePlayerStatus() {
	for (var i = 0; i < players.length; i++) {
		updatePlayersAngle(i)
		updatePlayersShooting(i)
		updatePlayersPosition(i);
	}
}

function updatePlayersAngle(i) {
	if (players[i].turnship) {
		players[i].angle += shipTurnSpeed;
	}
}

function updatePlayersShooting(i) {
	if (players[i].shooting) {
		//Create Bullet
		//players[i].x
		//players[i].y
		//players[i].angle
	}
}

function updatePlayersPosition(i) {
	var rad = angle * Math.PI / 180;
	var newPositionX = players[i].x + shipRunSpeed * Math.sin(rad);
	var newPositionY = players[i].y + shipRunSpeed * Math.cos(rad);
	checkCollideBorder(i, newPositionX, newPositionY);

}

function checkCollideBorder(i, newPositionX, newPositionY) {
	if (newPositionX > 0 && newPositionX + shipSize < screenWidth 
		&& newPositionY > 0 && newPositionY + shipSize < screenHeight) {
		players[i].x = newPositionX;
		players[i].y = newPositionY;
	} 
	else {
		if (newPositionX < 0)
			players[i].x = screenWidth - shipSize;
		else if (newPositionX + shipSize > screenWidth) {
			players[i].x = 0;
		}
		if (newPositionY < 0) {
			players[i].y = screenHeight - shipSize;
		} 
		else if (newPositionY + shipSize > screenHeight) {
			players[i].y = 0;
		}
	}
}
//Edit Her
setInterval(function () {
	if (gameStart && !gameEnd) {
		initPlayerPositionAndAngle();
		if (isLetGo) {
			updatePlayerStatus();
			//sendData();
		}
	}
}, 12);

setInterval(function() {
	updateTimer();
}, 1000);



