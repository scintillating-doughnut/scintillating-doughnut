//this one command gernerates all game state details at start of game once passed in an array of player names.

var GameState = function (players) {
  this.allPlayersNames = players;
  this.gameOver = false;
  this.players = [];
  this.questNumber = 1;
  this.goodWins = 0;
  this.badWins = 0;
  this.teamVote = 1;
  this.numberOfPlayers = players.length;
  this.avilableRoles = randomRoles(this.numberOfPlayers);
  this.questSet = {1 : null, 2 : null, 3 : null, 4 : null, 5 : null};

  for (var i = 0; i < this.numberOfPlayers; i++){
    this.players.push(new CreatePlayer(this.allPlayersNames[i],this.avilableRoles[i]));
  }
};

//ceates new player based on role and name passed in.

var CreatePlayer = function (playerName, role) {
  this.name = playerName;
  this.role = role;
  this.team = assignTeam(this.role);
  this.teamVote = null;
  this.questVote = null;
  this.leader = false;
  this.onTeam = false;
  this.isLady = false;
  this.beenLady = false;
  this.specialAbility = null;
};

//assigns team good or bad based on role thats passed in.

var assignTeam = function(role){
  if(role === 'Assassin' || role === 'Morgona' || role === 'Mordred' || role === 'minion' || role === 'oberon'){
    return 'bad';
  }else{
    return 'good';
  }
};

//generates random list of roles based on number of players in game.

var randomRoles = function (numberOfPlayers) {
  var goodRoles = ['Merlin', 'Percival', 'servent', 'servent', 'servent' , 'servent'];
  var badRoles = ['Assassin', 'Morgona', 'Mordred', 'minion', 'oberon'];
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

console.log(new GameState(['dakota','kevin','kris','justin','hacker']));

