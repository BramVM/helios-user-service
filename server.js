require('dotenv').config();
const express = require('express'),
  app = express(),  
  jwt = require('express-jwt'),
  jwks = require('jwks-rsa'),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose'),
  Player = require('./api/models/playerModel'),
  bodyParser = require('body-parser');
  const cors=require('cors');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKSURI
  }),
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ['RS256']
});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.CONNECTIONSTRING);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./api/routes/playerRoutes');

const whitelist = [
  'http://localhost:3000',
];
const corsOptions = {
  origin: function(origin, callback){
      const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use(jwtCheck);

routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
