var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http').Server(app);
//var gameController = require('gameController.js');
var gameLogic = require('gameLogic.js');

var port = process.env.PORT || 3000;

//array of current players, will get populated as players
//join the game
var currentPlayers = [];
var questMembers = [];
var readyCounter = 0;
var currentGame;
var teamVoteCounter = 0;
var questVoteCounter = 0;

//this function logs all the get and post requests made to
//the server.
var morganLogger = function (app, express) {
 app.use(morgan('dev'));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(bodyParser.json());
 app.use(express.static(__dirname + '/../client'));
};

morganLogger(app, express);

//starts the express server
var server = app.listen(port, function () {
  console.log('Server listening at port ', port);
});

// use socket.io with express server
var io = require('socket.io').listen(server);

io.on('connection', function (client) {  
    console.log('Client connected...');

    //on hearing enterPlayerName event, push player name
    //to array
    client.on('enterPlayerName', function (data) {
      currentPlayers.push(data);
      console.log(data);
      client.emit('messages', data +' added ');
    });

    //listens to ready event from each player
    client.on('ready', function (name) {
      //increases readyCounter each time a player transmit event
      readyCounter++;

      //if readyCounter is equal to # of players, pass currentPlayers
      //to gameLogic to start game
      if(readyCounter === currentPlayers.length){
        currentGame = new gameLogic.GameState(currentPlayers);
        client.emit('game-state-ready', currentGame);
      } else {
        client.emit('game-state-notReady', 'Not Ready' );
      }
    });

    client.on('teamPlayerVote', function (name, vote) {
      var playerVote  = { 
        name: name,
        teamVote: vote
      };

      teamVoteCounter++
      
      //send each playerVote to gameLogic with the currentGame

      //this will happen when each player has voted
      if(teamVoteCounter===currentPlayers.length){
        //send to gameLogic to canvas votes, game logic will
        //return if vote passed or not

        //emit state of current state to object
        client.emit('game-state', currentGame);

        //clear teamVoteCounter to 0 for the next team vote
        teamVoteCounter = 0;
      } else {
        client.emit('game-state', "not ready");
      }

    });

    client.on('teamQuestVote', function (name, vote) {
      questVoteCounter++;

      var playerVote  = { 
        name: name,
        teamVote: vote
      };
      
      gameLogic.vote();

      //send playerVote and currentGame to gameLogic 

      //send game state object to client
      client.emit('game-state-ready', currentGame);

    });

    client.on('confirmQuestMembers', function (names) {
      //send playerName and currentGame to gameLogic

      //send game state object to client
      client.emit('game-state-ready', currentGame);

    });

    client.on('questSize', function (names) {
      //ask gameLogic for number of quest members needed
      var size = gameLogic.getquestSize();
      client.emit('questSizeReply', size);
    });



});

app.get('/api/stats', gameController.allStats);

app.post('api/stats', gameController.addGameStats);





