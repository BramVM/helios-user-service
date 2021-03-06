'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  identityProviderId: {
    type: String,
    Required: 'Kindly enter the identityProviderId of the player'
  },
  position: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  story: {
    step: {
      type: Number,
      default: 0
    }
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Players', PlayerSchema);