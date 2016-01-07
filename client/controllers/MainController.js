var app = angular.module('SD', [])
  .controller('gameCtrl', function ($scope, $window, $location) {
    var socket = io.connect();
    // initialize the controller

    // initialize the playerName
    $scope.playerName = '';

    // when player enters a name, update the $scope
    $scope.enterPlayerName = function () {
      $scope.playerName = $scope.nameInput;

      ////////////////////////////////////////
      // send this input playerName to server
      ////////////////////////////////////////
      socket.emit('enterPlayerName', $scope.playerName);
    };

    $scope.ready = function () {
        socket.emit('ready', $scope.playerName)

    }

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
        socket.emit('votedYesForTeam', $scope.playerName);
      }
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
        socket.emit('votedNoForTeam', $scope.playerName);
      }
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
        socket.emit('votedYesForQuest', $scope.playerName);
      }
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
        socket.emit('votedNoForQuest', $scope.playerName);
      }
    };

    // when captain finishes selecting quest team, and confirms
    $scope.confirmQuestMembers = function () {
      // only sends data to server if this player is a captain
      if ($scope.thisPlayer.isCaptain) {

        // after setting those player's .onQuest to be true, send the gameState.
        socket.emit('confirmQuestMembers', $scope.gameState);
      }
    };

    // captain clicks button to start selecting quest members
    $scope.startQuestMemberSelection = function () {
      if($scope.thisPlayer.isCaptain) {
        // do something to the game state;
        // $scope.gameState;
        socket.emit('startQuestMemberSelection', $scope.gameState);
      }
    };

  });










