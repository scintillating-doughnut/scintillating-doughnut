//this one command gernerates all game state details at start of game once passed in an array of player names.

var GameState = function (players) {
  this.allPlayersNames = players;
  this.gameOver = false;
  this.players = [];
  this.questNumber = 1;
  this.goodWins = 0;
  this.badWins = 0;
  this.teamVoteFails = 1;
  this.numberOfPlayers = players.length;
  this.availableRoles = randomRoles(this.numberOfPlayers);
  this.questSet = {1 : null, 2 : null, 3 : null, 4 : null, 5 : null};

  for (var i = 0; i < this.numberOfPlayers; i++) {
    this.players.push(new CreatePlayer(this.allPlayersNames[i],this.availableRoles[i]));
  }
  assignLeader(this);
};

//ceates new player based on role and name passed in.

var CreatePlayer = function (playerName, role) {
  this.name = playerName;
  this.role = role;
  this.team = assignTeam(this.role);
  this.teamVote = null;
  this.questVote = null;
  this.isLeader = false;
  this.onTeam = false;
  this.isLady = false;
  this.beenLady = false;
  this.specialAbility = null;
};

//assigns team good or bad based on role thats passed in.

var assignTeam = function (role) {
  if (role === 'Assassin' || role === 'Morgona' || role === 'Mordred' || role === 'minion' || role === 'oberon') {
    return 'bad';
  } else {
    return 'good';
  }
};

//generates random list of roles based on number of players in game.

var randomRoles = function (numberOfPlayers) {
  var goodRoles = ['Merlin', 'Percival', 'Servent', 'Servent', 'Servent' , 'Servent'];
  var badRoles = ['Assassin', 'Morgana', 'Mordred', 'Minion', 'Oberon'];
  var playerSet = [];
  var randomPlayerSet = [];
  var numBad = Math.ceil(numberOfPlayers/3);
  var numGood = numberOfPlayers - numBad;

  for (var i = 0; i < numBad; i++) {
    playerSet.push(badRoles[i]);
  }
  for (var j = 0; j < numGood; j++) {
    playerSet.push(goodRoles[j]);
  }
  for (var r = 0; r < numberOfPlayers; r++) {
    var randomIndex = Math.floor(Math.random()*playerSet.length);
    randomPlayerSet.push(playerSet[randomIndex]);
    playerSet.splice(randomIndex,1);
  }
  return randomPlayerSet;
};

//assigns a random team leader for begining of game also assigns the lady of the lake to the player behind the leader.

var assignLeader = function (gameInstance) {
  var randomIndex = Math.floor(Math.random()*gameInstance.numberOfPlayers);
  gameInstance.players[randomIndex].isLeader = true;
  if (randomIndex !== 0) {
    gameInstance.players[randomIndex-1].isLady = true;
  } else {
    gameInstance.players[gameInstance.numberOfPlayers-1].isLady =true;
  }
};

//will rotate leader after each quest or team vote fail.

var rotateLeader = function (gameInstance) {
  var index = null;
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    if (gameInstance.players[i].isLeader === true) {
      index = i;
      gameInstance.players[i].isLeader = false;
    }
  }
  if (index === gameInstance.numberOfPlayers-1) {
    index = 0;
  } else {
    index++;
  }
  gameInstance.players[index].isLeader = true;
};

//will set players that are confirmed for a quest team. takes and input array of player names.

var confirmQuestMembers = function (playerNames) {

};

var test = new GameState(['dakota','kevin','kris','justin','hacker']);
console.log(test);
rotateLeader(test);

