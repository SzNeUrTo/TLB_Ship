var PYHTON_HOST = '127.0.0.1'
var PYTHON_PORT = 8081
var SOCKETIO_PORT = 8080;
var keys = {};
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
var bulletSpeed = 10;
var shipRunSpeed = 5;
var shipTurnSpeed = 5;
var gameStart = false;
var gameEnd = false;
var gameRemainingTime = 60;

//var bullet = {
//	x : -1,
//	y : -1,
//	angle : -1,
//	owner : 'GG'
//};
var isNot_initPosition = true;
var isLetGo = false;
// ---------------------------- server ---------------------------------------------
var io = require('socket.io').listen(SOCKETIO_PORT);
io.sockets.on('connection', function(socket) {
	viewers[viewers.length] = socket.id;
	console.log('Viewer Connection ID : ' + socket.id);
	if (gameStart) {
		sendDataToClient('clearPlayers');
		sendDataToClient('createPlayers');
	}
	// else {

	// }
	// sendDataToClient('createPlayers');
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
			console.log('GM CMD = GameStart => clearPlayers');
			gameStart = true;
			sendDataToClient('clearPlayers');
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
			if (keys[key] == null) {
			// index = socket.remoteAddress + data[1] + data[2] + data[3];
			// if (players[index] == null) {
				newIndex = players.length;
				keys[key] = newIndex;
				players_index[newIndex] = newIndex;

				var player = {
					sid : ID,
					lifepoint : 3,
					score : 0,
					x : 400,
					y : 400,
					angle : 0,
					checkVal : CheckVal,
					shooting : false,
					turnship : false
				}
				
				players[newIndex] = player;
				console.log('Players in if :');
				console.log(players);
			}
		}
		else if (gameStart && cmd == 'ShootingToggle') {
			//player shooting true
			key = socket.remoteAddress + data[1] + data[2] + data[3];
			index = keys[key];
			if (index != null) {
				players[index].shooting = true;
			}
			console.log('shooting');
		}
		else if (gameStart && cmd == 'TurnShipToggle') {
			key = socket.remoteAddress + data[1] + data[2] + data[3];
			index = keys[key];
			if (index != null) {
				players[index].turnship = !players[index].turnship;
			}
		}
		else if (cmd == 'Reset') {
			console.log('reset');
		}
	    //console.log('IP : ' + socket.remoteAddress + ' DATA_Recieve : ' + data);
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
			players[players_index[i]].x = screenWidth * i / players_index.length;
			players[players_index[i]].y = screenHeight * i / players_index.length;
			//console.log('------> players x + ' + players[players_index[i]].x + ' | y = ' + players[players_index[i]].y);
			// players[players_index[i]].angle = Math.floor((Math.random() * 360));
			// players[players_index[i]].x = 200 * i ;
			// players[players_index[i]].y = 200 * i ;


		}
		isNot_initPosition = false;
		sendDataToClient('clearPlayers');
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
	else if (cmd == 'clearPlayers') {
		io.sockets.emit(cmd, 'eiei');
	}
	else if (cmd == 'updateBullets') {
		io.sockets.emit(cmd, bullets);
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
		//console.log('--->  angle : ' + players[players_index[i]].angle);
		players[players_index[i]].angle += shipTurnSpeed;
		players[players_index[i]].angle %= 360;
	}
}

function updatePlayersShooting(i) {
	if (players[players_index[i]].shooting && players[players_index[i]].lifepoint > 0) {
		createBullet(players_index[i]);
		players[players_index[i]].shooting = false;
	}
}

function createBullet(players_index) {
	bullets.push({
		x : players[players_index].x,
		y : players[players_index].y,
		angle : players[players_index].angle,
		owner : players_index
	});
	//io.sockets.emit('createBullets', bullet);
}

function updateBullets() {
	bulletMoveMent();
	bulletsCollideShip();
	removeBullets();
	bulletsCollideBorder();
	console.log('bullet length = ' + bullets.length);
	console.log('bulletRemover length = ' + bulletsRemover.length);
	removeBullets();
	//console.log('updateBullet');
}
function bulletMoveMent() {
	for (var i = 0; i < bullets.length; i++) {
		var rad = bullets[i].angle * Math.PI / 180;
		bullets[i].x += bulletSpeed * Math.sin(rad);
		bullets[i].y += bulletSpeed * Math.cos(rad);
		//console.log('x = ' + bullets[i].x + '| y = ' + bullets[i].y);
	}
	sendDataToClient('updateBullets')
}

function bulletsCollideShip() {
	var sx, sy, bx, by;
	for (var i = 0; i < bullets.length; i++) {
		for (var j = 0; j < players_index.length; j++) {
			c_sx = players[players_index[j]].x + shipSize / 2;
			c_sy = players[players_index[j]].y + shipSize / 2;
			c_bx = bullets[i].x + bulletSize / 2;
			c_by = bullets[i].y + bulletSize / 2;
			if (Math.abs(c_sx - c_bx) < shipSize / 2 + bulletSize / 2 
				&& Math.abs(c_sy - c_by) < shipSize / 2 + bulletSize / 2) {
				//Collide
				if (bullets[i].owner == players_index[j]) {
					console.log('My Bullet Collide Me');
				}
				else {
					//var shooter = bullets[i].owner;
					players[players_index[j]].lifepoint -= 1;
					if (players[players_index[j]].lifepoint <= 0) {
						players[players_index[j]].lifepoint = 0;
						players[bullets[i].owner].score += 1;
					}
					//add to push [] remover
					var bulletIndex = i;
					bulletsRemover.push(bulletIndex);
					console.log('My Bullet Add to Remover : Bullet CollideShip');
				}
			}
		}
	}
}

function bulletsCollideBorder() {
	for (var i = 0; i < bullets.length; i++) {
		if (!(bullets[i].x > 0 && bullets[i].x < screenWidth - bulletSize && bullets[i].y > 0 && bullets[i].y < screenHeight - bulletSize)) {
			var bulletIndex = i;
			bulletsRemover.push(bulletIndex);
			//console.log('collide border na kub');
		}
	}
}

function removeBullets() {
	bulletsRemover.sort(function(a, b){return a-b});
	console.log(bulletsRemover);
	//sendDataToClient('removeBullets');
	var shiftIndex = 0;
	while (bulletsRemover.length > 0) {
		arrayRemoveAtIndex(bullets, bulletsRemover.splice(0, 1)[0] - shiftIndex);
		shiftIndex++;
	}
	//bulletsRemover = [];
}

function arrayRemoveAtIndex (arr, index) {
	console.log("Remove" + arr.splice(index, 1)[0]);
}

function updatePlayersPosition(i) {
	if (players[players_index[i]].lifepoint > 0) {
		var rad = players[players_index[i]].angle * Math.PI / 180;
		var newPositionX = players[players_index[i]].x + shipRunSpeed * Math.sin(rad);
		var newPositionY = players[players_index[i]].y + shipRunSpeed * Math.cos(rad);
		checkCollideBorder(i, newPositionX, newPositionY);
	}
	else {
		players[players_index[i]].x = -1000;
		players[players_index[i]].y = -1000;
	}
	sendDataToClient('updatePlayers');
}

function checkCollideBorder(i, newPositionX, newPositionY) {
	// if (newPositionX > 0 && newPositionX + shipSize < screenWidth 
	// 	&& newPositionY > 0 && newPositionY + shipSize < screenHeight) {
	// 	players[players_index[i]].x = newPositionX;
	// 	players[players_index[i]].y = newPositionY;
	// } 
	// else {
	// 	if (newPositionX < 0)
	// 		players[players_index[i]].x = screenWidth - shipSize;
	// 	else if (newPositionX + shipSize > screenWidth) {
	// 		players[players_index[i]].x = 0;
	// 	}
	// 	if (newPositionY < 0) {
	// 		players[players_index[i]].y = screenHeight - shipSize;
	// 	} 
	// 	else if (newPositionY + shipSize > screenHeight) {
	// 		players[players_index[i]].y = 0;
	// 	}
	// }

	players[players_index[i]].x = newPositionX;
	players[players_index[i]].y = newPositionY;
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
	// console.log('X = ' + players[players_index[i]].x + ' Y = ' + players[players_index[i]].y);
}
//Edit Here
setInterval(function () {
	if (gameStart && !gameEnd) {
		// console.log('Test');
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
	else {
		console.log('==================================================');
		for (var i = 0; i < players.length; i++) {
			console.log('Score : ' + players[i].score + '| index : ' + i);
		}
	}
}, 1000);


