// // define socketIO variable
// var socket = io();

// // when server updates gameState information,
// socket.on('updateGameState', function (gameState) {
//   // set the gameState to the global variable
//   window.gameState = gameState;

//   // find this player from game state
//   for (var i=0; i<gameState.players.length; i++) {
//     // if this player matches the player from game state
//     if (window.playerName === gameState.players[i].playerName) {
//       window.thisPlayer = gameState.players[i];
//       // exit the for loop, because name already found
//       break;
//     }
//   }
//   // call updateDisplay
//   updateDisplay();
// });

// // Upon valid player input, send data to server
// // Upon player input, send update up server, make sure to pass in the updated player
// var sendPlayerInput = function (thisPlayer) {
//   socket.emit('playerInput', thisPlayer);
// };

// // when the game state changes, update the client display
// var updateDisplay = function () {

// };






app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
