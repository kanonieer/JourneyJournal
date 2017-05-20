const express       = require('express');
const router        = express.Router();
const User          = require('./../models/user');
const Journey       = require('./../models/journey'); 
const passport      = require('passport');
const expressJwt    = require('express-jwt');
const jwt           = require('jsonwebtoken');
const account       = require('./../controller/account');
const journeyController       = require('./../controller/journey.controller');
const node_dropbox  = require('node-dropbox');
const config        = require('./../config/auth');
var access_token    = '';
const authenticate  = expressJwt(
    {secret: 'server secret temp',
     getToken: function (req) {
        var token = req.body.access_token || req.query.access_token || req.headers['x-access-token'] ;
        if (token) {
            return token;
        } 
            return null;
    }}
);


module.exports = function(app, passport) {
    //login email+password
    app.post('/login', passport.authenticate('local-login', {
            session:false
        }), generateToken, (req, res) => {
            res.status(200).json({
                user: req.user,
                token: req.token
            });
        });
    //sign up email+password
    app.post('/signup', passport.authenticate('local-signup', {
        session:false
        }),(req, res) =>{
            res.status(201).json(req.user);
        });
    //auth by facebook
    app.get('/auth/facebook', passport.authenticate('facebook'));
    //facebook auth callback
    app.get('/auth/facebook/callback', passport.authenticate('facebook',{ session:false }),
      generateToken, (req, res) => {
        res.redirect('http://localhost:4200/login/facebook?token='+req.token);  
      });
    //profile data
    app.post('/profile', authenticate, (req, res) => { res.status(200).json(req.user._doc) });
    //update email 
    app.patch('/email', authenticate, (req, res) => { account.changeEmail(req, res) });
    //change password
    app.patch('/password', authenticate, (req, res) => { account.changePassword(req, res) });
    //face add email and password
    app.post('/email',authenticate);
    //test dropbox
    app.get('/auth/dropbox', (req, res) => {
        node_dropbox.Authenticate(config.dropboxAuth.key, config.dropboxAuth.secret, config.dropboxAuth.callbackURL, function(err, url){
        res.redirect(url);    
        // redirect user to the url.
        // looks like this: "https://www.dropbox.com/1/oauth2/authorize?client_id=<key_here>&response_type=code&redirect_uri=<redirect_url_here>"
        });
    });
    app.get('/auth/dropbox/callback', (req, res) => {
        node_dropbox.AccessToken(config.dropboxAuth.key, config.dropboxAuth.secret, req.query.code, config.dropboxAuth.callbackURL, function(err, body) {
	        access_token = body.access_token;
            api = node_dropbox.api(access_token);
            api.account(function(err, res, body) {
                console.log(body);
            });
            res.redirect('http://localhost:4200');
        });
    });
    app.post('/journey', authenticate, (req, res)=> {journeyController.CreateJourney(req, res)});

    ///do testowania
    app.get('/users',(req,res)=>{
         User.find({}, (err, user) => {res.json(user)});
    });
    app.get('/journeys',(req,res)=>{
        Journey.find({},(err, journey)=>{res.json(journey)});
    });
    app.delete('/journeys', (req,res)=>{
        Journey.remove({}, function (err) {
        if (err) return handleError(err);
         res.status(201).json({ message:'Journeys deleted'});
        });
    })
};

const generateToken = (req, res, next) => {
    req.token = jwt.sign(req.user,'server secret temp',{expiresIn:60*120});
    next();
}