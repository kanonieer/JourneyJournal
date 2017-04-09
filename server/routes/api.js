const express       = require('express');
const router        = express.Router();
const User          = require('./../models/user'); 
const passport      = require('passport');
const expressJwt    = require('express-jwt');
const jwt           = require('jsonwebtoken');
const authenticate  = expressJwt(
    {secret: 'server secret temp',
     getToken: function (req) {
        var token = req.body.access_token || req.query.access_token || req.headers['x-access-token'] ;
        if (token) {
            return token;
        } 
            return null;
    }});

module.exports = function(app, passport) {

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        session:false
    }), generateToken, (req, res) => {
        res.status(200).json({
            user: req.user,
            token: req.token
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        session:false
    }),(req, res) =>{
        res.status(201).json(req.user);
    });

    app.get('/profile', authenticate, function(req, res){
        res.status(200).json(req.user);
    });
};

const generateToken = (req, res, next) => {
    req.token = jwt.sign(req.user,'server secret temp',{expiresIn:60*120});
    next();
}
/*

router.get('/auth/facebook', passport.authenticate('facebook', { session: false }),
    (req, res) => {
        console.log()
    }
);

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook',  (req, res) => {
        console.log("Pomyślnie zalogowano");
        res.status(200).json({msg:'Pomyslnie zalogowano'});
    })
);


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
*/
//module.exports = router;  