const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const database    = require('./config/database');
const app         = express();
const mongoose    = require('mongoose');
const passport    = require('passport');

let port = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Logger 
app.use(morgan('dev'));

//Passport config
require('./config/passport.js')(passport);

//Api
require('./routes/api.js')(app, passport);

mongoose.connect(database.database);

module.exports = app;