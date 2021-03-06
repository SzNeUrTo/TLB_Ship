var PYHTON_HOST = '127.0.0.1'
var PYTHON_PORT = 8081
var SOCKETIO_PORT = 8080
var viewers = [];
var players = [];
var players_index = [];
var bullets = [];
var removerPlayers = [];
var bulletsRemover = [];
var screenWidth = 800;
var screenHeight = 600;
var shipSize = 64;
var bulletSize = 4;
var bulletSpeed = 20;
var shipRunSpeed = 5;
var shipTurnSpeed = 5;
var gameStart = false;
var gameEnd = false;
var gameRemainingTime = 180;
var player = {
	sid : '5600000000',
	lifepoint : 3,
	score : 0,
	x : -1,
	y : -1,
	angle : 0,
	checkVal : '',
	shooting : false,
	turnship : false
}

var bullet = {
	x : -1,
	y : -1,
	angle : -1,
	owner : 'GG'
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
	//console.log(socket);
    console.log('CONNECTION for Python: ' + socket.remoteAddress +':'+ socket.remotePort);

	console.log('=================== Game is Started... ======================');
	var body = '';
	socket.on('data', function(data) {
		data = data + '';
		cmd = data.split('|')[0] + '';
		data = data.split('|');
		if (cmd == 'GameStart') {
			console.log('GM CMD = GameStart');
			gameStart = true;
			//createplyers
		}
		else if (cmd == 'PrepareToStart') {
			console.log('Close to join game...');
		}
		else if (cmd == 'LetGo') {
			console.log('Fighting');
			gameStart = true;
			isLetGo = true;
		}
		else if (cmd  == 'JoinGame' && !gameStart) {
			ID = data[1] + '';
			CheckVal = data[2] + '';
			console.log('***JoinGame :' + socket.remoteAddress + ' ' + ID + ' ' + CheckVal);
			console.log('Players ? :');
			console.log(players);
			
			key = socket.remoteAddress + data[1] + data[2] + data[3];
			// index = socket.remoteAddress + data[1] + data[2] + data[3];
			if (players[index] == null) {
				players_index[players_index.length] = index;
				players[index] = player;
				players[index].sid = ID;
				players[index].lifepoint = 3;
				players[index].score = 0;
				players[index].x = 200;
				players[index].y = 200;
				players[index].angle = 0;
				players[index].checkVal = CheckVal;
				players[index].shooting = false;
				players[index].turnship = false;
				console.log('Players in if :');
				console.log(players);
			}
		}
		else if (gameStart && cmd == 'ShootingToggle') {
			//player shooting true
			index = socket.remoteAddress + data[1] + data[2] + data[3];
			players[index].shooting = true;
			console.log('shooting');
		}
		else if (gameStart && cmd == 'TurnShipToggle') {
			index = socket.remoteAddress + data[1] + data[2] + data[3];
			players[index].turnship = !players[index].turnship;
			console.log('TurnShip ' + socket.remoteAddress);
		}
		else if (cmd == 'Reset') {
			console.log('reset');
		}
	    console.log('IP : ' + socket.remoteAddress + ' DATA_Recieve : ' + data);
	});

    socket.on('close', function(err) {
        console.log('Disconnect');
    });

}).listen(PYTHON_PORT, PYHTON_HOST, function() {
    console.log('----> Socket to talk to python !!!!!!!   Host : ' + PYHTON_HOST + ': PORT : ' + PYTHON_PORT + '   !!!!!!!!');
});
//--------------------------------------------  Game -------------------------------------------------
function initPlayerPositionAndAngle() {
	if (isNot_initPosition) {
		for (var i = 0; i < players_index.length; i++) {
			players[players_index[i]].x = screenWidth * i / size + shipSize;
			players[players_index[i]].y = screenHeight * i / size + shipSize;
			players[players_index[i]].angle = Math.floor((Math.random() * 360));
		}
		isNot_initPosition = false;
		sendDataToClient('createPlayers');
		console.log('initPlayerPositionAndAngle');
	}
}

function sendDataToClient(cmd) {
	cmd = cmd + '';
	if (cmd == 'updatePlayers') {
		io.sockets.emit(cmd, players, players_index);
	}
	else if (cmd == 'createPlayers') {
		io.sockets.emit(cmd, players, players_index);
	}
	else if (cmd == 'updateBullets') {
		io.sockets.emit(cmd, bullets);
	}
	else if (cmd == 'gameStart') {
		io.sockets.emit(cmd, players, players_index);
	}
	else if (cmd == 'gameEnd') {
		io.sockets.emit(cmd, players, players_index);
	}
	else if (cmd == 'removeBullets') {
		io.sockets.emit(cmd, bulletsRemover);
	}
	else if (cmd == 'updateTimer') {
		io.sockets.emit(cmd, gameRemainingTime);
	}
}

function updateTimer() {
	if (isLetGo) {
		io.sockets.emit('updateTimer', --gameRemainingTime);
		if (gameRemainingTime <= 0) {
			gameRemainingTime = 0;
			gameEnd = true;
		}
	}
}

function updatePlayerStatus() {
	for (var i = 0; i < players.length; i++) {
		updatePlayersAngle(i)
		updatePlayersShooting(i)
		updatePlayersPosition(i);
		shipCollideship(i);
	}
}

function shipCollideship (i) {
	for (var j = 0; j < players.length; j++) {
		if (i != j) {
			// Check Ship Collide Ship And Update Score And Die
		}
	};
}

function updatePlayersAngle(i) {
	if (players[players_index[i]].turnship) {
		players[players_index[i]].angle += shipTurnSpeed;
		players[players_index[i]].angle %= 360;
	}
}

function updatePlayersShooting(i) {
	if (players[players_index[i]].shooting) {
		createBullet(players_index[i]);
		players[players_index[i]].shooting = false;
	}
}

function createBullet(players_index) {
	var bullet = {
		x : players[players_index].x,
		y : players[players_index].y,
		angle : players[players_index].angle,
		owner : players_index
	};
	bullets.push(bullet);
	io.sockets.emit('createBullets', bullet);
}

function updateBullets() {
	bulletMoveMent();
	bulletsCollideShip();
	removeBullets();
	bulletsCollideBorder();
	removeBullets();
	//console.log('updateBullet');
}
function bulletMoveMent() {
	for (var i = 0; i < bullets.length; i++) {
		var rad = bullets[i].angle * Math.PI / 180;
		bullets[i].x += bulletSpeed * Math.sin(rad);
		bullets[i].y += bulletSpeed * Math.cos(rad);
	}
	sendDataToClient('updateBullets')
}

function bulletsCollideShip() {
	var sx, sy, bx, by;
	for (var i = 0; i < bullets.length; i++) {
		for (var j = 0; j < players_index.length; j++) {
			c_sx = players[players_index[i]].x + shipSize / 2;
			c_sy = players[players_index[i]].y + shipSize / 2;
			c_bx = bullets[i].x + bulletSize / 2;
			c_by = bullets[i].y + bulletSize / 2;
			if (Math.abs(c_sx - c_bx) < shipSize / 2 + bulletSize / 2 
				&& Math.abs(c_sy - c_by) < shipSize / 2 + bulletSize / 2) {
				//Collide
				if (bullets[i].owner == players_index[j]) {
					console.log('My Bullet Collide Me');
				}
				else {
					var shooter = bullets[i].owner;
					players[players_index[j]].lifepoint -= 1;
					if (players[players_index[j]].lifepoint <= 0) {
						players[players_index[j]].lifepoint = 0;
						players[shooting].score += 1;
					}
					//add to push [] remover
					var bulletIndex = i;
					bulletsRemover.push(bulletIndex);
				}
			}
		}
	}
}

function bulletsCollideBorder() {
	for (var i = 0; i < bullets.length; i++) {
		if (bullets[i].x < 0 || bullets[i].y < 0 || bullets[i].x + bulletSize > screenWidth || bullets[i].y + bulletSize < screenHeight)
			var bulletIndex = i;
			bulletsRemover.push(bulletIndex);
	}
}

function removeBullets() {
	bulletsRemover.sort(function(a, b){return a-b});
	sendDataToClient('removeBullets');
	var index = 0;
	while (index < bulletsRemover.length) {
		arrayRemoveAtIndex(bullets, bulletsRemover[index] - index);
		index++;
	}
	bulletsRemover = [];
}

function arrayRemoveAtIndex (arr, index) {
	console.log("Remove" + arr.splice(index,1));
}

function updatePlayersPosition(i) {
	if (players[players_index[i]].lifepoint > 0) {
		var rad = angle * Math.PI / 180;
		var newPositionX = players[players_index[i]].x + shipRunSpeed * Math.sin(rad);
		var newPositionY = players[players_index[i]].y + shipRunSpeed * Math.cos(rad);
		checkCollideBorder(i, newPositionX, newPositionY);
	}
	else {
		players[players_index[i]].x = -1000;
		players[players_index[i]].y = -1000;
	}
}

function checkCollideBorder(i, newPositionX, newPositionY) {
	if (newPositionX > 0 && newPositionX + shipSize < screenWidth 
		&& newPositionY > 0 && newPositionY + shipSize < screenHeight) {
		players[players_index[i]].x = newPositionX;
		players[players_index[i]].y = newPositionY;
	} 
	else {
		if (newPositionX < 0)
			players[players_index[i]].x = screenWidth - shipSize;
		else if (newPositionX + shipSize > screenWidth) {
			players[players_index[i]].x = 0;
		}
		if (newPositionY < 0) {
			players[players_index[i]].y = screenHeight - shipSize;
		} 
		else if (newPositionY + shipSize > screenHeight) {
			players[players_index[i]].y = 0;
		}
	}
}
//Edit Here
setInterval(function () {
	if (gameStart && !gameEnd) {
		initPlayerPositionAndAngle();
		if (isLetGo) {
			updatePlayerStatus();
			updateBullets();
			//updateScoreBoard();
		}
	}
}, 12);

setInterval(function() {
	if (!gameEnd)
		updateTimer();
}, 1000);


