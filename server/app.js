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
  res.header("Access-Control-Allow-Method", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Logger 
app.use(morgan('dev'));

//Passport config
require('./config/pass.js')(passport);

//Api
require('./routes/api.js')(app, passport);

mongoose.connect(database.database);

module.exports = app;

/*
require('./config/pass2.js')(passport);


app.use(passport.initialize())

var usersRoutes = require('./routes/api')(app, express, passport);
app.use('/users', usersRoutes);
*/
 

/*
app.get('/test',(req, res) => {
    res.status(200).json({msg:"działa?"});
});
app.get('/api/users/me',
  passport.authenticate('local', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });

app.post('/login', 
  passport.authenticate('local',{session: false}),
  function(req, res) {
      console.log('po authcie');
    res.json({msg:'nie wiem co tu wpisać'});
  });
  */
// routes ======================================================================
 // load our routes and pass in our app and fully configured passport



//app.use(cookieParser());
/*app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
*/
/*
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate()));


passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    console.log(profile);
                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.displayName;
                    newUser.facebook.email = 'test@test.pl';
                    //newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    //newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false);
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = password;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));
*/
//Api
//app.use('/api',api);
//secret for middleware
//app.set('superSecret', config.secret); // secret variable