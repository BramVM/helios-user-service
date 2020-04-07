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
console.log(process.env.CONNECTIONSTRING);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.CONNECTIONSTRING);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./api/routes/playerRoutes');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const whitelist = [
  'http://localhost:3000',
  'https://projectheliosremake.herokuapp.com',
  'http://projecthelios.azurewebsites.net',
];
const corsOptions = {
  origin: function(origin, callback){
      console.log('origin')
      console.log(origin)
      const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      //callback(null, originIsWhitelisted);
      callback(null, true);
  },
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers"
  ],
  credentials: true,
  enablePreflight: true
};
app.use(cors(corsOptions));

app.use(jwtCheck);

routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('RESTful API server started on: ' + port);
