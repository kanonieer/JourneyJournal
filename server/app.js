const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const config      = require('./config');
const app         = express();
const api         = require('./routes/api');

let port = process.env.PORT || 8080;

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Logger 
app.use(morgan('dev'));

//Api
app.use('/api',api);

//secret for middleware
//app.set('superSecret', config.secret); // secret variable

module.exports = app;