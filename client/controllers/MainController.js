
var socket = io();
//shrinkwrap
//dedeoop
//prune
var app = angular.module('SD', [])
  .controller('gameCtrl', function ($scope, $timeout) {

    // var socket = io.connect();
    // initialize the controller

    // initialize the playerName
    $scope.playerName = '';
    $scope.gameStatus = '';
    $scope.gameState = {players: []};
    $scope.showRoster = false;
    $scope.thisPlayer = {};

    // when player enters a name, update the $scope
    $scope.enterPlayerName = function () {
      $scope.playerName = $scope.nameInput;
      $scope.nameInput = '';

      ////////////////////////////////////////
      // send this input playerName to server
      ////////////////////////////////////////
      socket.emit('enterPlayerName', $scope.playerName);
      console.log($scope.playerName + " should've been sent to server.");
    };

    $scope.updateMyself = function (gameObject) {
      for (var i = 0; i<gameObject.players.length; i++) {
        if(gameObject.players[i].name === $scope.playerName) {
          $scope.thisPlayer = gameObject.players[i];
          break;
        }
      }
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
      socket.emit('teamPlayerVote', {name: $scope.playerName, teamVote:true});
      
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
      // if ($scope.thisPlayer.votedForTeam === false ) {
      //   $scope.thisPlayer.questVote = false;

      //   // State that the player has voted for quest already
      //   $scope.thisPlayer.votedForQuest = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
      socket.emit('questVote', {name: $scope.playerName, questVote: false});
      // }
    };

    // when captain finishes selecting quest team, and confirms
    // TODO
    $scope.confirmQuestMembers = function () {
      // only sends data to server if this player is a captain
      if ($scope.thisPlayer.isLeader) {

        // after setting those player's .onQuest to be true, find the players who are on a quest, and send it back
        var questMembers = [];

        for(var i=0; i<$scope.gameState.players.length; i++) {
          if($scope.gameState.players[i].onQuest) {
            questMembers.push($scope.gameState.players[i].name);
          }
        }
        console.log(questMembers);

        // if there are appropriate number of players selected for this quest
        if(questMembers.length === $scope.gameState.numberOfPlayersOnQuest) {
          socket.emit('confirmQuestMembers', questMembers);
        } else {
          alert('Select ' + $scope.gameState.numberOfPlayersOnQuest + ' players for this quest.');
        }
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
      $scope.updateMyself($scope.gameState);
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

});

  


  //   socket.on('questSizeReply', function(){
  // });
