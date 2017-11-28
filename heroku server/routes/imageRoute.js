const express       = require('express');
const router        = express.Router();
const Image         = require('./../models/image'); 
const imageController       = require('./../controller/image.controller');
const Auth          = require('./../config/authenticate');



module.exports = function(app, passport) {

    //add new image
    app.post('/images', Auth.authenticate, (req, res) => imageController.saveImage(req, res));

    //update image
    app.patch('/images/:id', Auth.authenticate, (req, res) => imageController.updateImage(req, res));

    //get images
    app.get('/images', Auth.authenticate, (req, res) => imageController.getImagesWithParam(req, res));

    //delete image
    app.delete('/images/:id', Auth.authenticate, (req, res) => imageController.deleteImageById(req, res));

}