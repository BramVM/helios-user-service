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


const routes = require('./api/routes/playerRoutes');

const whitelist = [
  'http://localhost:3000',
  'http://projecthelios.azurewebsites.net'
];
const corsOptions = {
  // origin: function(origin, callback){
  //     console.log(origin)
  //     const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
  //     callback(null, originIsWhitelisted);
  // },
  origin: '*',
  credentials: true,
  enablePreflight: true
};
//app.use(cors({origin: 'http://localhost:3000'}));
app.use(jwtCheck);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
});

app.listen(port);

console.log('RESTful API server started on: ' + port);
