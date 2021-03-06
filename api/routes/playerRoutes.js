'use strict';

module.exports = function (app) {
  var playerController = require('../controllers/playerController');

  app.route('/players')
    .get(playerController.list_all_players)
    .post(playerController.create_a_player)
    .patch(playerController.update_players);

  app.route('/active-player')
    .get(playerController.read_active_player);

  app.route('/players/:playerId')
    .patch(playerController.update_a_player)
    .delete(playerController.delete_a_player);
};
