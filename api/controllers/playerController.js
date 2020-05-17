'use strict';
const inputMappers = require('../mappers/inputMappers');
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

exports.read_active_player = function (req, res) {
  Player.findOne({ identityProviderId: req.user.sub }, async function (err, player) {
    if (err) {
      res.send(err);
    }
    if (player) {
      res.json(player);
    }
    else {
      // create the player
      var nuberOfPlayers = await Player.countDocuments();
      var new_player = new Player({
        identityProviderId: req.user.sub,
        position: startingPosition.generateStartposition(nuberOfPlayers),
        story: {
          step: 0
        }
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
