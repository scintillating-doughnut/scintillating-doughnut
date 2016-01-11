var socket = io();

angular.module('SD.services', [])

.service('GameService', [function(){
  this.playerName = '';
  this.gameState = {};
  this.gameStatus = '';
  this.myPlayer={};

  this.enterPlayerName = function (name) {
    this.playerName = name;
    socket.emit('enterPlayerName', name);
  };

  this.ready = function () {
    socket.emit('ready', this.playerName);
  };

  this.voteYesForTeam = function () {
    if (this.myPlayer.votedForTeam === false) {
      socket.emit('teamPlayerVote', {name: this.playerName, teamVote: true});
      this.myPlayer.votedForTeam = true;
    }
  };

  this.voteNoForTeam = function () {
    if (this.myPlayer.votedForTeam === false) {
      socket.emit('teamPlayerVote', {name: this.playerName, teamVote: false});
      this.myPlayer.votedForTeam = true;
    }
  };

  this.voteYesForQuest = function () {
    if (this.myPlayer.votedForQuest === false ) {
      socket.emit('questVote', {name: this.playerName, questVote: true});
      this.myPlayer.votedForQuest = true;
    }
  };

  this.voteNoForQuest = function () {
    if (this.myPlayer.votedForQuest === false ) {
      socket.emit('questVote', {name: this.playerName, questVote: false});
      this.myPlayer.votedForQuest = true;
    }
  };

  this.confirmQuestMembers = function () {
    console.log('confirm');
    // only sends data to server if this player is a captain
    if (this.myPlayer.isLeader) {
      // after setting those player's .onQuest to be true, send the gameState.
      this.gameState.votingForTeam = true;
      socket.emit('confirmQuestMembers', this.gameState);
    }
  };






  socket.on('game-state-notReady', function() {
    $scope.waitingStatus = 'Waiting for players...';
  });

  socket.on('game-state-ready', function (gameStateObject){
    alert("All players ready! See console for gamestate object");
    console.log(gameStateObject);
    // set global gameState with incoming gameStateobject
    $scope.gameState = gameStateObject;

    // Work around to update roster, due to ng-repeat one-time binding characteristic
    $timeout(function() {
      $scope.showRoster = true;
    });

    // assign $scope.thisPlayer to the correct player
    // loop through all players, find the one that matches my name
    $scope.updateMyself($scope.gameState);

    // ask captain to select a team
    if ($scope.thisPlayer.isLeader) {
      alert('Use below checkbox to select a team for the quest');
    } else {
      alert('Waiting for captain to select a team');
    }
  });

  // after captain selects a team, update everyone's roster, also ask player to vote on it
  socket.on('captain-team-pick', function (gameStateObject) {
    console.log('captain selected team');
    $scope.gameState = gameStateObject;

    // Display voting options
    $scope.gameState.votingForTeam = true;

    // Work around to update roster, due to ng-repeat one-time binding characteristic
    $timeout(function() {
      $scope.showRoster = true;
    });
  });

  // if all voting are in, and the team passes, lets go on a quest
  socket.on('start-quest', function (gameStateObject) {
    console.log('team voting complete, going on a quest');
    $scope.gameState = gameStateObject;
    // debugger;
    $scope.updateMyself($scope.gameState);

    // quest started, enable voting for the quest for players who are on the quest
    if ($scope.thisPlayer.onQuest) {
      $scope.gameState.votingForQuest = true;
    }

    $timeout(function() {
      $scope.showRoster = true;
    });
  });

  socket.on('team-vote-failed', function (gameStateObject) {
    console.log('team voting complete, failed, not going on a quest');
    $scope.gameState = gameStateObject;
    $scope.updateMyself($scope.gameState);
  });

  socket.on('game-over', function (gameStateObject) {
    $scope.gameState = gameStateObject;
    if ($scope.gameState.winner) {
      console.log('Good team wins!');
    } else {
      console.log('Bad team wins!');
    }
  });

  socket.on('quest-game', function (result) {
    if (result) {
      alert('This quest passed');
    } else {
      alert('This quest failed');
    }
  });

}]);

