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
var readyCounter = 0;
var currentGame;
var teamVoteCounter = 0;
var questVoteCounter = 0;
var currentQuestSize = 0;
var questMembers = [];

//this function logs all the get and post requests made to
//the server.
var morganLogger = function (app, express) {
 app.use(morgan('dev'));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(bodyParser.json());
 app.use(express.static('client/Ionic'));
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
    // console.log('player name received: ', data);

    currentPlayers.push(data);
    // console.log("Players", currentPlayers);
    // console.log("Game Object", currentGame);
    io.emit('messages', data +' added ');
    // io.emit('game-players', currentPlayers);
    console.log("Player Array ", currentPlayers);
  });

  //listens to ready event from each player
  client.on('ready', function (name) {
    //increases readyCounter each time a player transmit event
    readyCounter++;

    console.log("Players Ready #" + readyCounter + " " + name);
    //if readyCounter is equal to # of players, pass currentPlayers
    //to gameLogic to start game
    if(readyCounter === currentPlayers.length){
      currentGame = new gameLogic.GameState(currentPlayers);
      // currentPlayers = [];
      // readyCounter = 0;
      io.emit('game-state-ready', currentGame);

    } else {
      io.emit('game-state-notReady', 'Not Ready' );
    }
  });

  client.on('teamPlayerVote', function (data) {
    //increase teamVoteCounter for every vote that I get
    teamVoteCounter++;

    //send each playerVote to gameLogic with the currentGame
    gameLogic.setTeamVote(currentGame, data.name, data.teamVote);

    //this will happen when each player has voted
    if(teamVoteCounter===currentGame.players.length){
      //send to gameLogic to canvas votes, game logic will
      //return if vote passed or not
      var result = gameLogic.teamVoteOutcome(currentGame);

      //if team vote passes, send quest members to gameLogic
      if(result){
        io.emit('start-quest', currentGame);

      //if team vote fails, reset quest members and increase
      //vote fails
      } else {
        gameLogic.resetQuestMembers(currentGame);
        questMembers = [];
        currentGame.teamVoteFails++;
        gameLogic.rotateLeader(currentGame);

        gameLogic.checkGameOver(currentGame);
        if (gameLogic.gameOver) {
          io.emit('game-over', currentGame);
        } else {
          io.emit('team-vote-failed', currentGame);
        }

      }
      //clear teamVoteCounter to 0 for the next team vote
      teamVoteCounter = 0;

    } else {
      // io.emit('game-state', "not ready");
    }

  });

  client.on('teamQuestVote', function (data) {
    //increase quest vote
    questVoteCounter++;

    gameLogic.setQuestVote(currentGame, data.name, data.questVote);

    if(questVoteCounter === currentGame.numberOfPlayersOnQuest){
      var result = gameLogic.questVoteOutcome(currentGame);
      gameLogic.finishQuest(currentGame);

      // check if game is over after computing quest result
      if (currentGame.gameOver) {
        io.emit('game-over', currentGame);
      } else {
        //sends
        io.emit('quest-game', result);
        io.emit('next-quest', currentGame);
      }

      //resets questVoteCounter to 0
      questVoteCounter = 0;
      gameLogic.rotateLeader(currentGame);
    }


  });

  client.on('confirmQuestMembers', function (names) {

    //send playerName and currentGame to gameLogic
    for(var i = 0; i < names.length; i++){
      questMembers.push(names[i]);
    }
    gameLogic.confirmQuestMembers(currentGame, names);

    //send game state object to client
    io.emit('leader-selected-team', currentGame);

  });

  // client.on('questSize', function (names) {
  //   //ask gameLogic for number of quest members needed
    // currentQuestSize = gameLogic.peopleNeededForQuest(currentGame);
  //   client.emit('questSizeReply', size);
  // });


});

app.get('/api/stats', gameController.allStats);

app.post('api/stats', gameController.storeFinishedGameStats);

