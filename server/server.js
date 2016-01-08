var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var gameController = require('./db/gameController.js');
var gameLogic = require('./config/gameLogic.js');

var port = process.env.PORT || 3000;

//array of current players, will get populated as players
//join the game
var currentPlayers = [];
var questMembers = [];
var readyCounter = 0;
var currentGame;
var teamVoteCounter = 0;
var questVoteCounter = 0;
var currentQuestSize = 0;

//this function logs all the get and post requests made to
//the server.
var morganLogger = function (app, express) {
 app.use(morgan('dev'));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(bodyParser.json());
 app.use(express.static('client'));
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

  client.on('teamPlayerVote', function (data) {
    //increase teamVoteCounter for every vote that I get
    teamVoteCounter++
    
    //send each playerVote to gameLogic with the currentGame
    gameLogic.setTeamVote(currentGame, data.name, data.teamVote)

    //this will happen when each player has voted
    if(teamVoteCounter===currentPlayers.length){
      //send to gameLogic to canvas votes, game logic will
      //return if vote passed or not
      var result = gameLogic.teamVoteOutcome(currentGame);

      //if team vote passes, send quest members to gameLogic
      if(result){
        gameLogic.confirmQuestMembers(currentGame, questMembers);
      //if team vote fails, reset quest members and increase
      //vote fails
      } else {
        gameLogic.resetQuestMembers(currentGame);
        questMembers = [];
        currentGame.teamVoteFails++;
        gameLogic.checkGameOver(currentGame);
      }
      //emit state of current state to object
      client.emit('game-state', currentGame);

      //clear teamVoteCounter to 0 for the next team vote
      teamVoteCounter = 0;

    } else {
      client.emit('game-state', "not ready");
    }

  });

  client.on('teamQuestVote', function (data) {
    //increase quest vote 
    questVoteCounter++;

    gameLogic.setQuestVote(currentGame, data.name, data.questVote)
    
    if(questVoteCounter === currentGame.questSize){
      var result = gameLogic.questVoteOutcome(currentGame);
      gameLogic.finishQuest(currentGame);

      //sends 
      client.emit('game-state', result)

      //resets questVoteCounter to 0
      questVoteCounter = 0;
    }


  });

  client.on('confirmQuestMembers', function (names) {
    //send playerName and currentGame to gameLogic
    for(var name in names){
      questMembers.push(name);
    }

    //send game state object to client
    client.emit('game-state-ready', currentGame);

  });

  // client.on('questSize', function (names) {
  //   //ask gameLogic for number of quest members needed
  //   currentQuestSize = gameLogic.peopleNeededForQuest(currentGame);
  //   client.emit('questSizeReply', size);
  // });


});

// app.get('/api/stats', gameController.allStats);

// app.post('api/stats', gameController.addGameStats);

