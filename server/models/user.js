const mongoose  = require('mongoose');
const config    = require('./../config');
const Schema    = mongoose.Schema;

mongoose.connect(config.database);
const user = new Schema({
//   id: {type: Number, required: true},
  name: String
//   login: String,
//   password: String,
//   movies: Array,
//   admin: Boolean

});

const User = mongoose.model('User', user);

module.exports = User;