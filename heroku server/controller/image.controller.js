const Journey       = require('./../models/journey');
const User          = require('./../models/user'); 
const Image         = require('./../models/image');
const node_dropbox  = require('node-dropbox');
const DropboxClient = require('dropbox');
var fs              = require('fs');
const config        = require('./../config/auth');

 
//datauri.pipe(process.stdout);

module.exports = {
    getImages: (req, res) => {
        Image.find({ id_journey: req.params.id }, (err, images) => {
            res.status(200).json(images);
        });
    },
    updateImage: (req, res) => {
        User.findOne({ _id: req.user._doc._id }, (err, user) => {
            if (err) throw err;
            
            Image.findOne({ _id : req.params.id }, (err, image) => {
                if (err) throw err;

                if(typeof(req.body.isFavourite) === "boolean"){
                    image.isFavourite = req.body.isFavourite;
                }

                image.title = req.body.title || image.title;
                
                image.save((err) => {
                    if (err) throw err;
                    
                });
                res.status(200).json({message: "Success" , details: "Image successfully updated"});
            });
        });

    },
    getImagesWithParam: (req, res) => {
        const user_id = req.user._doc._id;
        const isFavourite = req.query.isFavourite;

        User.findOne({ _id: user_id }, (err, user) => {
            if (err) throw err;

            Image.find({ isFavourite: isFavourite, user_id: user_id }, (err, images) => {
                if (err) throw err;

                res.status(200).json(images);
            })
        })
    },
    saveImage: (req, res) => {
        const user_id = req.user._doc._id;
        User.findOne({ _id : user_id }, (err, user) => {
            if (err) throw err;

            if (!user) {
                res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
                console.log('User not found!'); 
            }
            if (user) {
                Journey.findOne({ _id: req.body.id_journey }, (err, journey) => {
                    if(err) throw err;

                    if(!journey){
                        res.status(404).json({message:'Not Found', details:'There is no journey with this ID'})
                    }
                    else{
                        var image = new Image({
                            date        : req.body.date,
                            longitude   : req.body.longitude,
                            latitude    : req.body.latitude,
                            id_journey  : req.body.id_journey,
                            tags        : req.body.tags,
                            isFavourite : req.body.isFavourite,
                            user_id     : user_id,
                            title       : journey.title
                        });
                        image.save((err) => {
                            if (err) throw err;
                            
                            console.log('Image successfully saved!');
                        });
                        res.status(201).json(image);
                    }
                });
            }
        });
    },
    deleteImageById: (req, res) => {
        const user_id = req.user._doc._id;
        const image_id = req.params.id;

        Image.findOne({ _id: image_id }, (err, image) => {
            if (err) throw err;

            if (!image) {
                res.status(404).json({ message:'Not Found', details: 'There is no image with this ID' });
            } else {
                if (user_id !== image.user_id) {
                    res.status(401).json({ message: 'Unauthorized', details: 'You have no access to this image' });
                } else {
                    Image.findOneAndRemove({ _id: image_id }, err => {
                        if (err) throw err;

                        res.status(200).json({ message: 'Success', details: 'Image successfully deleted'})
                    });
                }
            }
        });
    }
}