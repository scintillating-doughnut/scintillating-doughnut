var socket = io();

angular.module('app.controllers', [])
.service('Game', [function(){

  playerName = '';
  gameStatus = '';
  gameState = {players: []};
  showRoster = false;
  showSpecialPowers = false;
  showRoleToggle = false;
  thisPlayer = {};
  playerJoined = false;
  playerReadied = false;
  currentPlayers = [];

  return {
    playerName: '',
    gameStatus: '',
    gameState: {players: []},
    showRoster: false,
    showSpecialPowers: false,
    showRoleToggle: false,
    thisPlayer: {},
    playerJoined: false,
    playerReadied: false,
    currentPlayers: [],
    isReady: false
  }

}])

.controller('loginCtrl', function ($scope, $location, Game) {
  $scope.message = "Hi";

  $scope.submit = function () {
    $scope.message = "Hello";
  }

  $scope.enterPlayerName = function (name) {
      console.log("game status: ", Game.isThereGame);
      Game.playerName = name;
      $scope.nameInput = '';
      console.log("loginCtrl invoked");
      console.log(Game.playerName);

      // Hide name inputField
      $scope.playerJoined = true;

      ////////////////////////////////////////
      // send this input playerName to server
      ////////////////////////////////////////
      socket.emit('enterPlayerName', Game.playerName);
      console.log(Game.playerName + " should've been sent to server.");
      $location.path('/ready')

      socket.on('game-players', function(data) {
          console.log("data from server", data);
            Game.currentPlayers = data.slice();
            console.log("current players", Game.currentPlayers);
          //console.log(Game.currentPlayers);
        });

    };

})

.controller('readyCtrl', function ($scope, Game) {
  $scope.playerName = Game.playerName;
  $scope.canBeReady = false;

  if(!Game.isReady) {
    $scope.status = "NOT READY";
  } else {
    $scope.status ="READY";
  }

  socket.on('game-players', function(data) {
    console.log("socket emit received")

    $scope.$apply(function(){
      $scope.players = Game.currentPlayers.slice();
    })
    if(Game.currentPlayers.length >= 3){
      $scope.$apply(function(){
        $scope.canBeReady = true;
      })
    }
  });

  console.log($scope.players);

})
   
.controller('selectTeamCtrl', function($scope) {

})
   
.controller('approveTeamCtrl', function($scope) {

})
   
.controller('onQuestCtrl', function($scope) {

})
   
.controller('onQuest2Ctrl', function($scope) {

})
   
.controller('teamSelectionCtrl', function($scope) {

})
   
.controller('teamSelection2Ctrl', function($scope) {

})
 