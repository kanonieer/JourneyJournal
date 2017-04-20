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

    app.post('/login', passport.authenticate('local-login', {
            session:false
        }), generateToken, (req, res) => {
            res.status(200).json({
                user: req.user,
                token: req.token
            });
        });
    app.post('/signup', passport.authenticate('local-signup', {
        session:false
     }),(req, res) =>{
        res.status(201).json(req.user);
     });
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook',
     { session:false }),
      generateToken, (req, res) => {
        res.redirect('http://localhost:4200/login/facebook?token='+req.token);  
     });
    app.post('/profile', authenticate, function(req, res){
        res.status(200).json(req.user._doc);
     });
};

const generateToken = (req, res, next) => {
    req.token = jwt.sign(req.user,'server secret temp',{expiresIn:60*120});
    next();
}