var socket = io();
//shrinkwrap
//dedeoop
//prune
angular.module('SD.controllers', [])
  .controller('gameCtrl', function ($scope, $window,$ionicHistory, $location, $state, GameService) {
    // initialize the controller
    $scope.refresh = function () {
      console.log('refreshing');
      $scope.gameState = GameService.gameState;
      for(var i = 0 ; i < GameService.gameState.numberOfPlayers; i++){
        if(GameService.gameState.players[i].name === GameService.playerName){
          GameService.myPlayer = GameService.gameState.players[i];
          $scope.myPlayer = GameService.gameState.players[i];
        }
      }
      $scope.myPlayer = GameService.myPlayer;
      return GameService.myPlayer;
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
      if (GameService.myPlayer.votedForTeam === false ) {
        console.log('insisde yes', GameService.myPlayer)
        GameService.myPlayer.teamVote = true;

     // State that the player has voted for team already
        GameService.myPlayer.votedForTeam = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('teamPlayerVote', {name: GameService.playerName, teamVote:true});
        $scope.votingForTeam = true;
      }
    };

    // when player votes no for the team
    $scope.voteNoForTeam = function () {
      // only count the vote if the player hasn't voted for the team yet
      if (GameService.myPlayer.votedForTeam === false ) {
        GameService.myPlayer.teamVote = false;

        // State that the player has voted for team already
        GameService.myPlayer.votedForTeam = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('teamPlayerVote', {name:GameService.playerName, teamVote:false});
        $scope.votingForTeam = true;
      }
    };

    // when player votes yes for the quest
    $scope.voteYesForQuest = function () {
      // only count the vote if the player hasn't voted for the quest yet
      if (GameService.myPlayer.votedForQuest === false ) {
        $GameService.myPlayer.questVote = true;

      // State that the player has voted for quest already
        GameService.myPlayer.votedForQuest = true;
        console.log('my player',GameService.myPlayer);

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('questVote', {name: GameService.playerName, questVote: true});
      }
    };

    // when player votes yes for the quest
    $scope.voteNoForQuest = function () {
      // only count the vote if the player hasn't voted for the quest yet
      if (GameService.myPlayer.votedForQuest === false ) {
        GameService.myPlayer.questVote = false;


        // State that the player has voted for quest already
        GameService.myPlayer.votedForQuest = true;
        console.log('my player',GameService.myPlayer);

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
        socket.emit('questVote', {name: GameService.playerName, questVote: false});
        }
    };

    // when captain finishes selecting quest team, and confirms
    // TODO
    $scope.confirmQuestMembers = function () {
console.log('confirm')
      // only sends data to server if this player is a captain
      if (GameService.myPlayer.isLeader) {
        console.log('leader sleected team')

        // after setting those player's .onQuest to be true, send the gameState.
        GameService.gameState.votingForTeam =true;
        socket.emit('confirmQuestMembers', GameService.gameState);
      }
    };
    //TODO 
    $scope.startQuestMemberSelection= function () {
      // only sends data to server if this player is a captain
        // after setting those player's .onQuest to be true, send the gameState.
        socket.emit('questSize', GameService.gameState);
      
    };
    ////////////////////
    /* LISTENERS FOR BACKEND EVENTS */
    ////////////////////

    socket.on('game-state-notReady', function() {
      GameService.gameStatus = 'Waiting for players...';
    });

    socket.on('game-state-ready', function(gameStateObject){
      GameService.gameState = gameStateObject;
      $state.go('playerView');
      $scope.refresh();
      setTimeout(function(){
        $state.go('mainView');
        $scope.refresh();
        $ionicHistory.clearHistory();
      },2000);
      // $state.go('mainView');
      // $scope.refresh();

      console.log(gameStateObject);
    });

    socket.on('team-accepted', function(data){
      GameService.gameState = data;
      console.log('quest starting');

    });

    socket.on('leader-selected-team', function(data){
      GameService.gameState = data;
      $scope.gameState = data;
    })

});

  


  //   socket.on('questSizeReply', function(){
  // });
