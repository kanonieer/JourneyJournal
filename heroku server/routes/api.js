const express       = require('express');
const router        = express.Router();
const User          = require('./../models/user');
const passport      = require('passport');
const config        = require('./../config/auth');
const accountController       = require('./../controller/account.controller');
const imageController         = require('./../controller/image.controller');
const Auth          = require('./../config/authenticate');


module.exports = function(app, passport) {

    //login email+password
    app.post('/login', passport.authenticate('local-login', {
            session:false
        }), Auth.generateToken, (req, res) => {
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

    // auth wit facebook
    app.post('/facebookAuthorization', (req, res) => accountController.authWithFacebook(req, res));

    // add facebook auth
    app.patch('/users/:id/addFacebook', Auth.authenticate, (req, res) => accountController.addFacebookAuth(req, res));

    // remove facebook auth
    app.patch('/users/:id/removeFacebook', Auth.authenticate, (req, res) => accountController.removeFacebookAuth(req, res));

    // add local auth
    app.patch('/users/:id/addLocal', Auth.authenticate, (req, res) => accountController.addLocalAuth(req, res));

    // remove local auth
    app.patch('/users/:id/removeLocal', Auth.authenticate, (req, res) => accountController.removeLocalAuth(req, res));

    //profile data
    app.post('/profile', Auth.authenticate, (req, res) => res.status(200).json(req.user._doc));

    //change email 
    app.patch('/users/:id/email', Auth.authenticate, (req, res) => accountController.changeEmail(req, res));

    //change password
    app.patch('/users/:id/password', Auth.authenticate, (req, res) => accountController.changePassword(req, res));

    //face add email and password
    app.post('/email', Auth.authenticate);

    //delete user
    app.delete('/users/:id', Auth.authenticate, (req, res) => accountController.deleteUser(req, res));

    ///
    ///do testowania
    //app.get('/users',(req,res)=>{
    //     User.find({}, (err, user) => {res.json(user)});
    //});

};