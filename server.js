var io = require('socket.io').listen(8080);

io.sockets.on('connection', function(socket) {
	console.log('connection on');
	io.sockets.emit('menu', {pizza: 'Hawaiian pizza'});

	socket.on('order', function(pizza) {
		console.log('You want to order menu ', pizza);
	});
	
	socket.on('disconnect', function() {
		io.sockets.emit('end call');
	});
});  

var net = require('net');  // node v0.10.21 (latest)
var PYTHON = {HOST :'127.0.0.1', PORT :8081};

net.createServer(function(socket) {
    console.log('CONNECTION for Python: ' + socket.remoteAddress +':'+ socket.remotePort);

    var body = '';
    socket.on('data', function(data) {
        console.log('DATA ' + socket.remoteAddress + ' eiei : ' + data);
        body += data;
		io.sockets.emit('menu', {pizza: (data+'')});
    });

    socket.on('close', function(err) {
        console.log('finish transmitting data... ');
        console.log(body);
    });
}).listen(PYTHON.PORT, PYTHON.HOST, function() {
    console.log('----> socket to talk to python ' + PYTHON.HOST + ':' + PYTHON.PORT);
});
