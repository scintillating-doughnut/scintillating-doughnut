var app = angular.module('SD', [])
  .controller('gameCtrl', function ($scope, socket, $window, $location) {

    // initialize the controller

    // initialize the playerName
    $scope.playerName = '';

    // when player enters a name, update the $scope
    $scope.enterPlayerName = function () {
      $scope.playerName = $scope.nameInput;

      ////////////////////////////////////////
      // send this input playerName to server
      ////////////////////////////////////////
    };

    // when player votes yes for the team
    $scope.voteYesForTeam = function () {
      // only count the vote if the player hasn't voted for the team yet
      if ($scope.thisPlayer.votedForTeam === false ) {
        $scope.thisPlayer.teamVote = true;

        // State that the player has voted for team already
        $scope.thisPlayer.votedForTeam = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
      }
    };

    // when player votes no for the team
    $scope.voteNoForTeam = function () {
      // only count the vote if the player hasn't voted for the team yet
      if ($scope.thisPlayer.votedForTeam === false ) {
        $scope.thisPlayer.teamVote = false;

        // State that the player has voted for team already
        $scope.thisPlayer.votedForTeam = true;

        ////////////////////////////////////////
        // send this input playerName to server
        ////////////////////////////////////////
      }
    };

  });
