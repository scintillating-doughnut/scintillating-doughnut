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
        client.emit('game-state', currentGame);
      }
    });

    client.on('teamPlayerVote', function (name, vote) {
      var playerVote  = { 
        name: name,
        teamVote: vote
      };

      teamVoteCounter++
      //send each playerVote to gameLogic with the currentGame

      if(teamVoteCounter===currentPlayers.length){
        //send to gameLogic to canvas votes, game logic will
        //return if vote passed or not

        //emit state of current state to object
        client.emit('game-state', currentGame);

        //clear teamVoteCounter to 0;
        teamVoteCounter = 0;
      } else {
        client.emit('game-state', "not ready");
      }

    });

    client.on('teamQuestVote', function (name, vote) {
      var playerVote  = { 
        name: name,
        teamVote: vote

        gameLogic.vote(currentGame);
      };

      //send playerVote and currentGame to gameLogic 

      //send game state object to client
      client.emit('game-state', currentGame);

    });

    client.on('startQuestMemberSelection', function (name) ) {
      //send playerName and currentGame to gameLogic

      
    }



});

app.post('/api/player/', function (req, res) {
   //if gameState = true, send an error, user shouldn'y be able to join 

  // if(gameState.inPlay ==== true){
  //   res.send("send error")
  // }
  currentPlayers.push(req.body.name);
  res.json({name: req.body.name});


});

//start a game
app.post('api/game/start', function (req, res) {
  //game.GameState(currentPlayers);
});

//make moves
app.put('api/game/move/:moveType', function (req, res) {
  console.log("move type", req.params.moveType);
  var move = req.params.moveType;

  if(move === "setTeam"){
    //set isOnTeam properties of chosen players to true;
  }

  if(move === "teamVote"){
    //iterate through all players and count team votes
    //respond with pass or fail, set failedTeamVotes accpurdingly
  }

  if(move === "questVote"){
    //iterate through all players that isOnTeam and check
    //questVote, if any are false, failedQuest++ and respond
    //with fail, otherwise, respond with pass
  }

});

//ends a game, responds with game results
app.post('api/game/end', function (req, res) {
  gameState.inPlay = true;
});

//
// app.get('/api/stats', gameController.allStats);

// app.post('api/stats', gameController.addGameStats);





