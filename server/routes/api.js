const express       = require('express');
const router        = express.Router();
const User          = require('./../models/user');
const Journey       = require('./../models/journey'); 
const passport      = require('passport');
const expressJwt    = require('express-jwt');
const jwt           = require('jsonwebtoken');
const node_dropbox  = require('node-dropbox');
const config        = require('./../config/auth');
const accountController       = require('./../controller/account.controller');
const imageController         = require('./../controller/image.controller');
const journeyController       = require('./../controller/journey.controller');
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
    // //auth by facebook
    // app.get('/auth/facebook', passport.authenticate('facebook'));
    // //facebook auth callback
    // app.get('/auth/facebook/callback', passport.authenticate('facebook',{ session:false }),
    //   generateToken, (req, res) => {
    //     res.redirect('http://localhost:4200/login/facebook?token='+req.token);  
    //   });
    // auth wit facebook new
    app.post('/facebookAuthorization', (req, res) => { accountController.authWithFacebook(req, res)});
    //profile data
    app.post('/profile', authenticate, (req, res) => res.status(200).json(req.user._doc));
    //update email 
    app.patch('/email', authenticate, (req, res) => accountController.changeEmail(req, res));
    //change password
    app.patch('/password', authenticate, (req, res) => accountController.changePassword(req, res));
    //face add email and password
    app.post('/email', authenticate);
    //post new journey
    app.post('/journeys', authenticate, (req, res) => journeyController.createJourney(req, res));
    //get user journeys
    app.get('/journeys', authenticate, (req, res) => journeyController.getJourneys(req, res));
    //app journey by id
    app.get('/journeys/:id', authenticate, (req, res) => journeyController.getJourneyById(req, res));
    //edit journey
    app.patch('/journeys/:id', authenticatem, (req, res) => journeyController.editJourney(req, res));
    //get images of journey
    app.get('/journeys/:id/images', authenticate, (req, res) => imageController.getImages(req, res));  
    //save image to database
    app.post('/images', authenticate, (req, res) => imageController.saveImage(req, res));
    //update image
    app.patch('/images/:id', authenticate, (req, res) => imageController.updateImage(req, res));
    //get images
    app.get('/images', authenticate, (req, res) => {imageController.getImagesWithParam(req, res)});

    app.delete('/images/:id', authenticate, (req, res) => imageController.deleteImageById(req, res));

    ///
    ///do testowania
    app.get('/users',(req,res)=>{
         User.find({}, (err, user) => {res.json(user)});
    });
    
    ////
    ////
    // app.get('/journeys',(req,res)=>{
    //     Journey.find({},(err, journey)=>{res.json(journey)});
    // });
    app.delete('/journeys/:id', authenticate, (req, res) => journeyController.deleteJourneyById(req, res));

};

const generateToken = (req, res, next) => {
    req.token = jwt.sign(req.user,'server secret temp',{expiresIn:6000*1200});
    next();
}