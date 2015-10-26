var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //When the user connects, ask for their name
  console.log('user opened page')
  //When the user presses send, send their message
  socket.on('save movie', function(moviename){
    io.emit('save entry', moviename);
  });
  //check username for validity
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
