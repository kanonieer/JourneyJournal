var express     = require('express');
var router      = express.Router();
var User        = require('./../models/user'); // users
var passport = require('passport');
// middleware here

 // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }), (req, res) => 
        console.log("Pomyślnie zalogowano"));


router.post('/signup', passport.authenticate('local-signup', (req, res) => {
    res.json({msg:"Zarejestrowano"});
}));

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user.username);
  });



// create new user (POST http://localhost:8080/api/users)
router.post('/users', (req, res) => {
    console.log("wchodzę w posta");
    let user = new User({ 
        name: req.body.name
    });
    user.save( (err) => {
        if (err) throw err;

        console.log('User created successfully');
        res.status(201).json(user);
    });
}); 

// get all users (GET http://localhost:8080/api/users)
router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
      res.json(users);
    });
});

//get test
router.get('/test', (req, res) => {
    res.json({message: "Hello World"});
});

module.exports = router;  