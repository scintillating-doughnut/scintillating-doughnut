//this one command gernerates all game state details at start of game once passed in an array of player names.
//gameInstance will refere to the whole game state object being passed in.
var GameState = function (players) {
  this.allPlayersNames = players;
  this.gameOver = false;
  this.players = [];
  this.questNumber = 1;
  this.numberOfPlayersOnQuest = peopleNeededForQuest(this);
  this.goodWins = 0;
  this.badWins = 0;
  this.teamVoteFails = 1;
  this.winner = null;
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
  this.onQuest = false;
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
var confirmQuestMembers = function (gameInstance, playerNames) {
  resetQuestMembers(gameInstance);
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    if (playerNames.indexOf(gameInstance.players[i].name) !== -1) {
      gameInstance.players[i].onQuest = true;
    }
  }
  resetTeamVote(gameInstance);
  resetQuestVotes(gameInstance);
};

//will reset all players onQuest property to false for new vote.
var resetQuestMembers = function (gameInstance) {
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    gameInstance.players[i].onQuest = false;
  }
};

//reset all players team votes to null.
var resetTeamVote = function (gameInstance) {
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    gameInstance.players[i].teamVote = null;
  }
};

//resets all players quest votes to null.
var resetQuestVotes = function (gameInstance) {
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    gameInstance.players[i].questVote = null;
  }
};

//sets each player team vote property to true or false bassed on yes or
//no input one player name and vote for each call. vote arrg is boolean.
var setTeamVote = function (gameInstance, playerName, vote) {
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    if (gameInstance.players[i].name === playerName){
      gameInstance.players[i].teamVote = vote;
    }
  }
};

//sets quest votes for players that are on the quest team, one player at a time, vote is boolean
var setQuestVote = function (gameInstance, playerName, vote) {
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    if (gameInstance.players[i].name === playerName){
      gameInstance.players[i].questVote = vote;
    }
  }
};

//takes input checkedPlayerName which is the player the lady decied to check.
//function will return null if lady tries to check themself or someone that has
//been the lady before. return team 'good' or 'bad' if a proper check can be completed.
var ladyCheck = function (gameInstance, checkedPlayerName) {
  for (var i =0; i < gameInstance.numberOfPlayers; i++) {
    if (gameInstance.players[i].isLady === true) {
      if (gameInstance.players[i].name === checkedPlayerName) {
        //return null if lady trys to check herself.
        return null;
      }
      gameInstance.players[i].beenLady = true;
      gameInstance.players[i].isLady = false;
    }
  }
  for (var j = 0; j < gameInstance.numberOfPlayers; j++) {
    if (gameInstance.players[j].name === checkedPlayerName) {
      if (gameInstance.players[j].beenLady === true) {
        //can't check player that has already been lady before return null;
        return null;
      }
      gameInstance.players[j].isLady = true;
      return gameInstance.players[j].team;
    }
  }
};

//checks team vote outcome returns true if pass false if fail and null if not everyone voted.
var teamVoteOutcome = function (gameInstance) {
  var yesCount = 0;
  var noCount = 0;
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    if (gameInstance.players[i].teamVote === true) {
      yesCount++;
    } else if (gameInstance.players[i].teamVote === false) {
      noCount++;
    } else {
      return null;
    }
  }
  if (yesCount > noCount) {
    gameInstance.teamVoteFails = 1;
  } else {
    gameInstance.teamVoteFails++;
  }
  rotateLeader(gameInstance);
  //resetTeamVote(gameInstance);
  return yesCount > noCount;
};

//checks quest vote outcome returns true if pass false if fail and null if not all quest members voted.
//also accounts for safety rounds that requier 2 fails to fail and noramlly only needs one fail to fail.
var questVoteOutcome = function (gameInstance) {
  var safety = false;
  var fails = 0;
  var passes = 0;
  //checking if saftey round is needed
  if (gameInstance.numberOfPlayers > 6 && gameInstance.questNumber === 4) {
    safety = true;
  }
  for (var i = 0; i < gameInstance.numberOfPlayers; i++) {
    if (gameInstance.players[i].onQuest === true){
      if (gameInstance.players[i].questVote === true) {
        passes++;
      } else if (gameInstance.players[i].questVote === false) {
        fails++;
      } else {
        return null;
      }
    }
  }
  //if safety round check to see if there are at least 2 fails to fail
  //else check to see is 0 fails for pass.
  if (safety === true) {
    return fails < 2;
  } else {
    return fails === 0;
  }
};

//function is called when quest is  completed. It checks the outcome of the quest vote.
//if vote was true from pass then it increases good wins if it was false from fail it increases bad wins.
//function will return null if all votes were not valid. if was pass or fail then function increases quest counter
//and checks for gameover and returns appropriate value of that function see below.
var finishQuest = function (gameInstance) {
  var questOutcome = questVoteOutcome(gameInstance);
  gameInstance.questSet[gameInstance.questNumber]=questOutcome;
  if (questOutcome === true) {
    gameInstance.goodWins++;
  } else if (questOutcome === false) {
    gameInstance.badWins++;
  } else {
    return null;
  }
  gameInstance.questNumber++;
  gameInstance.numberOfPlayersOnQuest = peopleNeededForQuest(gameInstance);
  checkGameOver(gameInstance);
};

//game over then will returun true if good won the game false if bad won the game and null
// if theres no game over and continue playing;
var checkGameOver = function (gameInstance) {
  if (gameInstance.teamVoteFails >5) {
    gameInstance.gameOver = true;
    gameInstance.winner = false;
  }
  if (gameInstance.goodWins === 3) {
    gameInstance.gameOver = true;
    gameInstance.winner = true;
  } else if (gameInstance.badWins === 3) {
    gameInstance.gameOver = true;
    gameInstance.winner = false;
  }
};

//outputs the number of people required for current quest based on numbe rof players.
var peopleNeededForQuest = function (gameInstance) {
  var people = 2;
  if (gameInstance.numberOfPlayers > 7) {
    people++;
  }
  if (gameInstance.questNumber > 1) {
    people++;
  }
  if (gameInstance.numberOfPlayers > 7 && gameInstance.questNumber > 3) {
    people++;
  }
  if (gameInstance.numberOfPlayers === 5 && gameInstance.questNumber === 3) {
    people--;
  }
  if (gameInstance.numberOfPlayers === 6) {
    if (gameInstance.questNumber === 3 || gameInstance.questNumber === 5) {
      people++;
    }
  }
  if (gameInstance.numberOfPlayers === 7 && gameInstance.questNumber >3) {
    people++;
  }
  return people;
};

module.exports = {
  GameState: GameState,
  CreatePlayer: CreatePlayer,
  teamVoteOutcome: teamVoteOutcome,
  resetQuestMembers: resetQuestMembers,
  confirmQuestMembers: confirmQuestMembers,
  checkGameOver: checkGameOver,
  setTeamVote: setTeamVote
};


//test for number of people in game function


// var people = [];
// var round =1;
// for(var i = 5; i < 11; i++){
//   for(var j = 0; j < i; j++){
//     people.push(j);
//   }
//   var test = new GameState(people);

//   while(round < 6){
//     console.log('players', i, 'round', round, 'people needed' ,peopleNeededForQuest(test));
//     round++;
//     test.questNumber = round;
//   }
//   round = 1;
//   people = [];
// }

//test for other functions

// var test = new GameState(['six','dakota','kevin','kris','justin','hacker','seven']);
// console.log(test);
// rotateLeader(test);
// test.questNumber = 4;
// test.badWins = 2;
// confirmQuestMembers(test, ['dakota','hacker','kevin']);
// setQuestVote(test, 'dakota', true);
// setQuestVote(test, 'kevin', false);
// setTeamVote(test, 'justin', false);
// setQuestVote(test, 'hacker', false);
// setTeamVote(test, 'kris', true);
// setTeamVote(test, 'six', true);
// console.log(test.players);
// console.log(ladyCheck(test, 'kevin'));
// console.log(questVoteOutcome(test));
// console.log(finishQuest(test));

