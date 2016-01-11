var mongoose = require('mongoose');

var StatsChema = new mongoose.Schema({
  sweetWon: Boolean,
  numPlayers: Number,
  gameTime: Number,
  numRoundsPlayed: Number
});

module.exports = mongoose.models('Stats', StatsSchema);
