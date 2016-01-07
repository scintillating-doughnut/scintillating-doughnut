var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var morgan = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/client'));
app.use(bodyparser.json());

app.get('/', function(req, res) {
  res.send('Hello, World!');
});

app.post('/api/players/:id', function (req, res) {
  console.log("ID", req.params.id);
})



var server = app.listen(port, function () {
  console.log('Server listening at port ', port);
});

module.exports = app;
