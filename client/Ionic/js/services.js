var socket = io();

angular.module('SD.services', [])

.service('GameService', [function(){
  this.playerName = '';
  this.gameState = {};
  this.gameStatus = '';
  this.myPlayer={};

  socket.on()

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

}]);

