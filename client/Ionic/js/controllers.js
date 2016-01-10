var socket = io();
//shrinkwrap
//dedeoop
//prune
angular.module('SD.controllers', [])
  .controller('gameCtrl', function ($scope, $window, $location, $state, GameService) {

    // initialize the controller
    $scope.refresh = function () {
      $scope.gameState = GameService.gameState;
    };

    // when player enters a name, update the $scope
    $scope.enterPlayerName = function (name) {
      GameService.playerName = name;
      $scope.playerName = name;

      ////////////////////////////////////////
      // send this input playerName to server
      ////////////////////////////////////////
      socket.emit('enterPlayerName', name);
      console.log(GameService.playerName + " should've been sent to server.", $scope.readyHide);
    };

    $scope.ready = function () {
        socket.emit('ready', GameService.playerName);
        GameService.gameStatus = 'Waiting on players...';
        console.log('you are ready and waiting for everyone');

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
        socket.emit('teamPlayerVote', {name: GameService.playerName, teamVote:true})

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
        socket.emit('teamPlayerVote', {name:GameService.playerName, teamVote:false});
      
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
        socket.emit('questVote', {name: GameService.playerName, questVote: true});
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
        socket.emit('questVote', {name: GameService.playerName, questVote: false});
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
      GameService.gameStatus = 'Waiting for players...';
    });

    socket.on('game-state-ready', function(gameStateObject){
      alert("All players ready! See console for gamestate object");
      GameService.gameState = gameStateObject;
      $state.go('page');

      console.log(gameStateObject);
    });

});

  


  //   socket.on('questSizeReply', function(){
  // });
