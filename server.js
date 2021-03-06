var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
connections = [];

server.listen(port, () => {
	console.log('Server running on ' + port);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	
	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	socket.on('send message', function(data) {
		io.to(data.src).emit('new message', {msg: data.msg});
	});

	socket.on('join', function(data) {
		socket.join(data);
	});
});
