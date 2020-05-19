require('dotenv').config();
var cors = require('cors')
const express = require('express'),
  app = express(),  
  jwt = require('express-jwt'),
  jwks = require('jwks-rsa'),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose'),
  Player = require('./api/models/playerModel'),
  bodyParser = require('body-parser');

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
const mongoConnectionOptions ={
  useNewUrlParser: true,
  useUnifiedTopology: true
}
mongoose.Promise = global.Promise;
mongoose.connect(process.env.CONNECTIONSTRING, mongoConnectionOptions);


const routes = require('./api/routes/playerRoutes');

const allowedOrigins = [
  "http://localhost:3000",
  "http://projecthelios.azurewebsites.net",
  "http://bram-lab.com",
  "https://projecthelios.azurewebsites.net",
  "https://bram-lab.com"
]

const corsOptions = {
  origin: function(origin, callback){
      const originIsWhitelisted = allowedOrigins.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
  },
  credentials: true,
  enablePreflight: true
};
app.use(function(req, res, next) {
  let origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Referer, User-Agent');
  res.setHeader('Content-Type', 'application/json')
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

console.log('RESTful API server for player-service started on: ' + port);
