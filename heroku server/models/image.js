const mongoose  = require('mongoose');
const database  = require('./../config/database');
const Schema    = mongoose.Schema;

const image = new Schema({
        date        : String,
        longitude   : String,
        latitude    : String,
        id_journey  : String,
        tags        : Array,
        isFavourite : Boolean,
        user_id     : String,
        title       : String 
});


const Image = mongoose.model('Image', image);

module.exports = Image;