const mongoose  = require('mongoose');
const database  = require('./../config/database');
const Schema    = mongoose.Schema;

const journey = new Schema({
        date_start   : Date,
        date_end     : Date,
        id_user      : String,
        title        : String,
        id_disc      : String
});


const Journey = mongoose.model('Journey', journey);

module.exports = Journey;