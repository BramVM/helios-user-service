/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./api/controllers/playerController.js":
/*!*********************************************!*\
  !*** ./api/controllers/playerController.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const inputMappers = __webpack_require__(/*! ../mappers/inputMappers */ "./api/mappers/inputMappers.js");
const mongoose = __webpack_require__(/*! mongoose */ "mongoose"),
  Player = mongoose.model('Players');

mongoose.set('useFindAndModify', false);
  //playerRepository = require('../repositries/playerRepository');



exports.list_all_players = function(req, res) {
  Player.find({}, function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json(player);
  });
};


exports.create_a_player = function(req, res) {
  var new_player = new Player(req.body);
  new_player.save(function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json(player);
  });
};

exports.read_active_player = function(req, res) {
  console.log('requested active player');
  Player.findOne({identityProviderId:req.user.sub}, function(err, player) {
    if (err){
      res.send(err);
    }
    if (player){
      console.log(player)
      res.setHeader('Content-Type', 'application/json')
      res.json(player);
    }
    else {
      // create the player
      var nuberOfPlayers = Player.count;
      if (nuberOfPlayers+1%8 === 1){
        
      }
      var new_player = new Player({
        identityProviderId:req.user.sub,
        email: req.user.email,
        position:{
          x: 8000,
          y: 8000
        },
        story:{
          step:0
        }
      });
      new_player.save(function(err, player) {
        if (err) {
          console.log(err)
          res.send(err);
        }
        res.setHeader('Content-Type', 'application/json')
        res.json(player);
      });
    }
  });
};

exports.update_a_player = async function(req, res) {
  const player = inputMappers.mapPlayer(req.body)
  Player.findOneAndUpdate({_id:req.params.playerId}, player, {new: true}, function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json(player);
  });
};

exports.update_players = async function(req, res) {
  req.body.forEach(item => {
    const player = inputMappers.mapPlayer(item)
    Player.findOneAndUpdate({_id:player._id}, player, {new: true}, function(err, player) {
      if (err)
        res.send(err);
      res.setHeader('Content-Type', 'application/json')
      res.json(player);
    });
  });
};

// Player.remove({}).exec(function(){});
exports.delete_a_player = function(req, res) {
  Player.remove({
    _id: req.params.playerId
  }, function(err, player) {
    if (err)
      res.send(err);
    res.setHeader('Content-Type', 'application/json')
    res.json({ message: 'Player successfully deleted' });
  });
};


/***/ }),

/***/ "./api/mappers/inputMappers.js":
/*!*************************************!*\
  !*** ./api/mappers/inputMappers.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.mapPlayer = (input) => {
  const player = {
    position: {
      x:input.position.x,
      y:input.position.y
    },
    story:{
      step:input.story.step
    }
  }
  return player
}

/***/ }),

/***/ "./api/models/playerModel.js":
/*!***********************************!*\
  !*** ./api/models/playerModel.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  identityProviderId: {
    type: String,
    Required: 'Kindly enter the identityProviderId of the player'
  },
  email: {
    type: String,
    Required: 'Kindly enter the email of the player'
  },
  position: {
    x:{
      type: Number,
      default: 0
    },
    y:{
      type: Number,
      default: 0
    }
  },
  story:{
    step:{
      type: Number,
      default: 0
    }
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  // status: {
  //   type: [{
  //     type: String,
  //     enum: ['active']
  //   }],
  //   default: ['active']
  // }
});


module.exports = mongoose.model('Players', PlayerSchema);

/***/ }),

/***/ "./api/routes/playerRoutes.js":
/*!************************************!*\
  !*** ./api/routes/playerRoutes.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function(app) {
	var playerController = __webpack_require__(/*! ../controllers/playerController */ "./api/controllers/playerController.js");

	// playerController Routes
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


/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! dotenv */ "dotenv").config();
var cors = __webpack_require__(/*! cors */ "cors")
const express = __webpack_require__(/*! express */ "express"),
  app = express(),  
  jwt = __webpack_require__(/*! express-jwt */ "express-jwt"),
  jwks = __webpack_require__(/*! jwks-rsa */ "jwks-rsa"),
  port = "5000" || false,
  mongoose = __webpack_require__(/*! mongoose */ "mongoose"),
  Player = __webpack_require__(/*! ./api/models/playerModel */ "./api/models/playerModel.js"),
  bodyParser = __webpack_require__(/*! body-parser */ "body-parser");


const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://project-helios.eu.auth0.com/.well-known/jwks.json"
  }),
  audience: "JoIiAy0WMIHx5F808UVv7YgIpofYJil6",
  issuer: "https://project-helios.eu.auth0.com/",
  algorithms: ['RS256']
});
console.log("mongodb+srv://Bram_69:el2cIflH6wSoi7CD@heliosusers-7l1bc.mongodb.net/test?retryWrites=true&w=majority");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://Bram_69:el2cIflH6wSoi7CD@heliosusers-7l1bc.mongodb.net/test?retryWrites=true&w=majority");


const routes = __webpack_require__(/*! ./api/routes/playerRoutes */ "./api/routes/playerRoutes.js");

const whitelist = [
  'http://localhost:3000',
  'http://projecthelios.azurewebsites.net',
  'http://bram-lab.com'
];
const corsOptions = {
  origin: function(origin, callback){
      console.log(origin)
      const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
  },
  credentials: true,
  enablePreflight: true
};
app.use(function(req, res, next) {
  let allowedOrigins = ["http://localhost:3000", "http://projecthelios.azurewebsites.net", "http://bram-lab.com", "https://projecthelios.azurewebsites.net", "https://bram-lab.com"]
  let origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Referer, User-Agent');
  next();
});
app.options('*', cors())
app.use(jwtCheck);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),

/***/ "jwks-rsa":
/*!***************************!*\
  !*** external "jwks-rsa" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jwks-rsa");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ })

/******/ });
//# sourceMappingURL=serverScript.js.map