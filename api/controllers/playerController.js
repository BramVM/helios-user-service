'use strict';
const inputMappers = require('../mappers/inputMappers')
const stationServiceApi = require('../../out-api/station-service-api')
const StationTileTypes = require('../../constants/index')
const mongoose = require('mongoose'),
  Player = mongoose.model('Players');

mongoose.set('useFindAndModify', false);
const startingPosition = require('../helpers/startingPosition');

exports.list_all_players = function (req, res) {
  Player.find({}, function (err, player) {
    if (err)
      res.send(err);
    else
      res.json(player);
  });
};

exports.create_a_player = function (req, res) {
  var new_player = new Player(req.body);
  new_player.save(function (err, player) {
    if (err)
      res.send(err);
    else
      res.json(player);
  });
};

var randomOption = function (options) {
  return options[Math.round(Math.random() * (options.length - 1))]
}

exports.read_active_player = function (req, res) {
  Player.findOne({ identityProviderId: req.user.sub }, async function (err, player) {
    if (err) {
      res.send(err);
    }
    if (player) {
      console.log(player)
      res.json(player);
    }
    else {
      // create the player
      var nuberOfPlayers = await Player.countDocuments();
      var position = startingPosition.generateStartposition(nuberOfPlayers);
      var new_player = new Player({
        identityProviderId: req.user.sub,
        position,
        story: {
          step: 0
        }
      });
      await stationServiceApi.getToken().then(token => {
        const tilePos = randomOption([[1,0],[-1,0],[0,1],[-1,1],[-1,-1],[0,-1]]);
        const stationPos = randomOption([
          { x: position.x - 2000, y: position.y },
          { x: position.x + 2000, y: position.y },
          { x: position.x, y: position.y + 2000 },
          { x: position.x, y: position.y - 2000 }
        ]);
        stationServiceApi.createStation({
          playerId: new_player._id,
          position: stationPos,
          tiles: [{
            x: 0,
            y: 0,
            type: 'ACCESS',
            broken: false
          },
          {
            x: tilePos[0],
            y: tilePos[1],
            type: 'POWER GENERATOR',
            broken: true
          }]
        }).then(station => console.log(station))
      });

      new_player.save(function (err, player) {
        if (err) {
          console.log(err)
          res.send(err);
        }
        else
          res.json(player);
      });
    }
  });
};

exports.update_a_player = function (req, res) {
  const player = inputMappers.mapPlayer(req.body)
  Player.findOneAndUpdate({ _id: req.params.playerId }, player, { new: true }, function (err, player) {
    if (err)
      res.send(err);
    else
      res.json(player);
  });
};

exports.update_players = function (req, res) {
  req.body.forEach(item => {
    const player = inputMappers.mapPlayer(item)
    Player.findOneAndUpdate({ _id: player._id }, player, { new: true }, function (err, player) {
      if (err)
        res.send(err);
    });
  });
  res.json({ message: 'Players successfully updated' });
};

// Player.remove({}).exec(function(){});
exports.delete_a_player = function (req, res) {
  Player.remove({
    _id: req.params.playerId
  }, function (err, player) {
    if (err)
      res.send();
    else
      res.json({ message: 'Player successfully deleted' });
  });
};
