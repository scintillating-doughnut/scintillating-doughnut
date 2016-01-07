var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var stats = require()
var gameController = require('gameController.js');

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/donut');

//=========================================

//initial request to '/' will just be sent to '/'
//front-end will deal with serving desired view
app.get('/', function(req, res) {
  res.send('/');
});

//intial
app.post('/api/players/:id', function (req, res) {
  console.log("ID", req.params.id);


});

app.get('/api/stats', function (req, res) {
  gameController.allStats();  
});

app.post('api/stats', function (req, res) {

});

//this function logs all the get and post requests made to
//the server.
var morganLogger = function (app, express) {
 app.use(morgan('dev'));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(bodyParser.json());
 app.use(express.static(__dirname + '/../../client'));
};

morganLogger(app, express);

var server = app.listen(port, function () {
  console.log('Server listening at port ', port);
});


