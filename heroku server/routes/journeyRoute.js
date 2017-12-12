const express       = require('express');
const router        = express.Router();
const Journey       = require('./../models/journey'); 
const journeyController       = require('./../controller/journey.controller');
const imageController       = require('./../controller/image.controller');
const Auth          = require('./../config/authenticate');




module.exports = function(app, passport) {

    //create journey
    app.post('/journeys', Auth.authenticate, (req, res) => journeyController.createJourney(req, res));

    //get user journeys
    app.get('/users/:id/journeys', Auth.authenticate, (req, res) => journeyController.getJourneys(req, res));

    //get journey by id
    app.get('/journeys/:id', Auth.authenticate, (req, res) => journeyController.getJourneyById(req, res));

    //edit journey
    app.patch('/journeys/:id', Auth.authenticate, (req, res) => journeyController.editJourney(req, res));

    //get images of journey
    app.get('/journeys/:id/images', Auth.authenticate, (req, res) => imageController.getImages(req, res));

    //delete journey by id
    app.delete('/journeys/:id', Auth.authenticate, (req, res) => journeyController.deleteJourneyById(req, res));
    
    //get gallery zip url
    app.get('/journeys/:id/download', Auth.authenticate, (req, res) => journeyController.getJourneyImagesZipUrl(req, res));

    //set background image
    //app.get('/journeys/:id/backgroundImage', Auth.authenticate, (req, res) => journeyController.SetBackgroundImage(req, res));
}  