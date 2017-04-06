const mongoose  = require('mongoose');
const database  = require('./../config/database');
const Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


//mongoose.connect(database.database);
const user = new Schema({
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

user.plugin(passportLocalMongoose);
/*// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};*/

const User = mongoose.model('User', user);

module.exports = User;