var express     = require('express');
var router      = express.Router();
var User        = require('./../models/user'); // users

// middleware here
//router.use((req,res,next) => {});

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