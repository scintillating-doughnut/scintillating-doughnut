var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/client'));
app.use(bodyparser.json());

var server = app.listen(port, function () {
  var host = server.address().address;

  console.log('Server listening at http://'+ host +':' + port);
});

module.exports = app;