var goodRoles = ['Merlin', 'Percival', 'servent', 'servent', 'servent' , 'servent'];
var badRoles = ['Assassin', 'Morgona', 'Mordred', 'minion', 'oberon'];

var randomRoles = function(numberOfPlayers){
  var playerSet = [];
  var randomPlayerSet = [];
  var numBad = Math.ceil(numberOfPlayers/3);
  var numGood = numberOfPlayers - numBad;

  for(var i = 0; i < numBad; i++){
    playerSet.push(badRoles[i]);
  }
  for(var j = 0; j < numGood; j++){
    playerSet.push(goodRoles[j]);
  }

  for(var r = 0; r < numberOfPlayers; r++){
    var randomIndex = Math.floor(Math.random()*playerSet.length);
    randomPlayerSet.push(playerSet[randomIndex]);
    playerSet.splice(randomIndex,1);
  }





  return randomPlayerSet;
};

console.log(randomRoles(5));