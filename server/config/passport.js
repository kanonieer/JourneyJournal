// config/passport.js
'use strict';

const LocalStrategy     = require('passport-local').Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const User              = require('./../models/user');
const mongoose          = require('mongoose');
const configAuth        = require('./auth');

module.exports = function(passport) {

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true,
        },
        function(req, email, password, done) {

            if (email)
                email = email.toLowerCase(); 

            // asynchronous
            process.nextTick(function() {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false);

                    if (!user.validPassword(password))
                        return done(null, false);

                    else
                        return done(null, user);
                });
            });
    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        session: false
        },
        function(req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:
                if (!req.user) {
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, false);
                        } else {

                            // create the user
                            var newUser            = new User();

                            newUser.local.email    = email;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });
                // if the user is logged in but has no local account...
                } else if ( !req.user.local.email ) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        if (err)
                            return done(err);
                        
                        if (user) {
                            return done(null, false);
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = newUser.generateHash(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);
                                
                                return done(null,user);
                            });
                        }
                    });
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });
    }));

passport.use('local',new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        session: false,
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
                console.log(newUser);
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

}))
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
// passport.use(new FacebookStrategy({
//     clientID: configAuth.facebookAuth.clientID,
//     clientSecret: configAuth.facebookAuth.clientSecret,
//     callbackURL: configAuth.facebookAuth.callbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//                         // create the user
//     var user = new User();
//     user.facebook.id  = profile.id;
//     user.facebook.token = accessToken;
//     user.facebook.name = profile.name;
//     user.email = 'test@test.pl';

//     user.save(function(err) {
//         if (err)
//             return done(err);

//         return done(null, user);
//     });
//   }
// ));
// // strategia logowania przez FB
// passport.use(new FacebookStrategy({
//   clientID: configAuth.facebookAuth.clientID,
//   clientSecret: configAuth.facebookAuth.clientSecret,
//   callbackURL: '/auth/facebook/callback',
//   profileFields: ['name', 'email'],
//   passReqToCallback: true,
//   session: false
// }, function (req, token, refreshToken, profile, done) {
//   // zakladam, ze istnieje mozliwosc zalozenia konta za pomoca emaila i hasla
//   // i mozna wtedy dowiazac konto FB, jezeli nie to ten if nie bedzie potrzebny
//   if (req.user) {
//     User.findOne({
//       facebook: profile.id
//     }, function (err, user) {
//       if (user) {
//         req.flash('error', {
//           msg: 'There is already an existing account linked with Facebook that belongs to you.'
//         });
//         done(err);
//       } else {
//         User.findById(req.user.id, function (err, user) {
//             user.facebook.id    = profile.id; // set the users facebook id                   
//             user.facebook.token = token; // we will save the token that facebook provides to the user                    
//             user.facebook.name  = profile.displayName;
//             user.facebook.email = 'test@test.pl';
//             user.save(function (err) {
//                 req.flash('success', {
//                 msg: 'Your Facebook account has been linked.'
//                 });
//                 done(err, user);
//             });
//         });
//       }
//     });
//   } else {
//     // sprawdzamy czy ten profil jest juz zarejestrowany w naszej bazie
//     User.findOne({
//       facebook : profile.id
//     }, function (err, user) {
//       // jezeli tak to logujemy
//       if (user) {
//         return done(err, user);
//       }
//       // jezeli nie to tworzymy nowe konto
//       User.findOne({
//         email: profile._json.email
//       }, function (err, user) {
//         if (user) {
//           req.flash('error', {
//             msg: user.email + ' is already associated with another account.'
//           });
//           done(err);
//         } else {
//           const newUser = new User({
//             name: profile.name.givenName + ' ' + profile.name.familyName,
//             email: profile._json.email,
//             gender: profile._json.gender,
//             location: profile._json.location && profile._json.location.name,
//             picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
//             facebook: profile.id
//           });
//           newUser.save(function (err) {
//             done(err, newUser);
//           });
//         }
//       });
//     });
//   }
// }));


}