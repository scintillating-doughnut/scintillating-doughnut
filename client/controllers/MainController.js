
var socket = io();
//shrinkwrap
//dedeoop
//prune
var app = angular.module('SD', [])
  .controller('gameCtrl', function ($scope, $window, $location) {

    // var socket = io.connect();
    // initialize the controller

    // initialize the playerName
    $scope.playerName = '';
    $scope.gameStatus = '';

    // when player enters a name, update the $scope
    $scope.enterPlayerName = function () {
      $scope.playerName = $scope.nameInput; 
      $scope.nameInput = '';

      ////////////////////////////////////////
      // send this input playerName to server
      ////////////////////////////////////////
      socket.emit('enterPlayerName', $scope.playerName);
      console.log($scope.playerName + " should've been sent to server.")
    };

    $scope.ready = function () {
        socket.emit('ready', $scope.playerName);
        $scope.gameStatus = 'Waiting on players...';

    };

    // when player votes yes for the team
    $scope.voteYesForTeam = function () {
      // only count the vote if the player hasn't voted for the team yet
      // if ($scope.thisPlayer.votedForTeam === false ) {
      //   $scope.thisPlayer.teamVote = true;

      //   // State that the player has voted for team already
      //   $scope.thisPlayer.votedForTeam = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('teamPlayerVote', {name: $scope.playerName, teamVote:true})
      
    };

    // when player votes no for the team
    $scope.voteNoForTeam = function () {
      // only count the vote if the player hasn't voted for the team yet
      // if ($scope.thisPlayer.votedForTeam === false ) {
      //   $scope.thisPlayer.teamVote = false;

      //   // State that the player has voted for team already
      //   $scope.thisPlayer.votedForTeam = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('teamPlayerVote', {name:$scope.playerName, teamVote:false});
      
    };

    // when player votes yes for the quest
    $scope.voteYesForQuest = function () {
      // only count the vote if the player hasn't voted for the quest yet
      // if ($scope.thisPlayer.votedForQuest === false ) {
      //   $scope.thisPlayer.questVote = true;

      //   // State that the player has voted for quest already
      //   $scope.thisPlayer.votedForQuest = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('questVote', {name: $scope.playerName, questVote: true});
    };

    // when player votes yes for the quest
    $scope.voteNoForQuest = function () {
      // only count the vote if the player hasn't voted for the quest yet
      if ($scope.thisPlayer.votedForTeam === false ) {
        $scope.thisPlayer.questVote = false;

        // State that the player has voted for quest already
        $scope.thisPlayer.votedForQuest = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('questVote', {name: $scope.playerName, questVote: false});
      }
    };

    // when captain finishes selecting quest team, and confirms
    // TODO
    $scope.confirmQuestMembers = function () {
      // only sends data to server if this player is a captain
      if ($scope.thisPlayer.isCaptain) {

        // after setting those player's .onQuest to be true, send the gameState.
        socket.emit('confirmQuestMembers', $scope.gameState);
      }
    };
    //TODO 
    $scope.startQuestMemberSelection= function () {
      // only sends data to server if this player is a captain
        // after setting those player's .onQuest to be true, send the gameState.
        socket.emit('questSize', $scope.gameState);
      
    };
    ////////////////////
    /* LISTENERS FOR BACKEND EVENTS */
    ////////////////////

    socket.on('game-state-notReady', function() {
      $scope.waitingStatus = 'Waiting for players...';
    });

});

  

  //   socket.on('game-state-ready', function(gameStateObject){
  //     //render views based on the gamestate object that's sent back 
  //   })
  //   socket.on('questSizeReply', function(){
  // });
