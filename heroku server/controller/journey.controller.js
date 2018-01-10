const Journey   = require('./../models/journey');
const Image     = require('./../models/image');
const User      = require('./../models/user');
const cloudinary  = require('cloudinary');
const CloudinaryConfig = require('./../config/cloudinary')

cloudinary.config({ 
  cloud_name: CloudinaryConfig.cloud_name, 
  api_key: CloudinaryConfig.api_key, 
  api_secret: CloudinaryConfig.api_secret
});

module.exports = {
    createJourney: (req, res) => {
        User.findOne({_id : req.user._doc._id}, (err, user) => {
            if (err) {
                res.status(500).json({message: 'Internal Server Error'})
                console.log(err);
            };

            if (!user) {
                res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
                console.log('User not found!'); 
            }
            if (user) {
                if (req.body.date_start == undefined) {
                    res.status(401).json({message:"Start date is not set"});
                    console.log("Start date is not set");
                } else {
                    if (req.body.date_end == undefined) {
                        res.status(401).json({message:"End date is not set"});
                        console.log("End date is not set");
                    } else {
                        if (req.body.title == undefined) {
                            res.status(401).json({message:"Title is not set"});
                            console.log("Title is not set");
                        } else {
                                if(req.body.description == undefined){
                                    req.status(401).json({message: "Description is not set"})
                                } else {
                                var journey = new Journey({
                                    date_start:         req.body.date_start,
                                    date_end:           req.body.date_end,
                                    id_user:            user._id,
                                    title:              req.body.title,
                                    id_disc:            req.body.id_disc,
                                    description:        req.body.description,
                                    background_image_id:""
                                });
                                journey.save((err) => {
                                    if (err) {
                                        res.status(500).json({message: 'Internal Server Error'})
                                        console.log(err);
                                    };
                                    
                                    console.log('Journey successfully added!');
                                    res.status(201).json({ message:'Journey added', details: 'Journey successfully added', data: journey})
                                }); 
                                
                                }
                            }
                        }
                    }
                }
        })
    },
    getJourneys: (req, res) => {
        if (req.params.id != req.user._doc._id) {
            res.status(403).json({ message: "You have no access to journeys of this user" });
        }
        else {
            User.findOne({ _id : req.params.id}, (err, user) => {
                if (err) {
                    res.status(500).json({message: 'Internal Server Error'})
                    console.log(err);
                };

                if (!user) {
                    res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
                    console.log('User not found!');                 
                } else {
                    Journey.find({ id_user : user._id }, (err, journeys) => {
                        if (err) {
                            res.status(500).json({message: 'Internal Server Error'})
                            console.log(err);
                        };
                        if (!journeys) {
                            res.status(404).json({ message:'Not Found', details: 'There are no journeys with this ID of user' });
                        } else {
                            res.status(200).json(journeys);
                        }
                    });
                }
            });
        }
    },

    getJourneyById: (req, res) => {
        Journey.findOne({ _id : req.params.id}, (err, journey) => {
            if (err) {
                res.status(500).json({message: 'Internal Server Error'})
                console.log(err);
            };

            if (!journey) {
                res.status(404).json({ message:'Not Found', details: 'There is no journey with this ID' });
                console.log('Journey not found!');                 
            } else {
                res.status(200).json(journey);
            }
        });
    },

    deleteJourneyById: (req, res) => {
        Image.find({id_journey : req.params.id}, (err, images) => {
            if (err) {
                res.status(500).json({message: 'Internal Server Error'})
                console.log(err);
            };

            if (!images){
                res.status(404).json({message: "There is no Images with this ID of Journey"});
                console.log("Images not found");
            } else {
                for (var i=0; i<images.length; i++){
                    Image.findOneAndRemove({_id : images[i]._id}, (err) => {
                        if(err) {
                            res.status(500).json({message: 'Internal Server Error'})
                            console.log(err);
                        };
                    });
                    cloudinary.uploader.destroy(images[i]._id, function(result) { console.log(result) });
                }
                Journey.findOneAndRemove({_id : req.params.id}, function(err) {
                    if (err) {
                        res.status(500).json({message: 'Internal Server Error'})
                        console.log(err);
                    };
                    res.status(200).json("Journey with images successfully deleted");
                });
            }
        });
    },
    editJourney: (req, res) => {
        User.findOne({ _id : req.user._doc._id}, (err, user) => {
            if (err) {
                res.status(500).json({message: 'Internal Server Error'})
                console.log(err);
            };

            if (!user) {
                res.status(404).json({message: "There is no user with this ID"});
                console.log("User not found!");
            } else {
                Journey.findOne({ _id : req.params.id}, (err, journey) => {
                    if (err) {
                        res.status(500).json({message: 'Internal Server Error'})
                        console.log(err);
                    };
                    if (!journey){
                        res.status(404).json({message: "There is no journey with this ID"});
                        console.log("Journey not found!");
                    } else {
                        if (req.body.date_start !== undefined && req.body.date_start !== ''){
                            journey.date_start = req.body.date_start;
                        }
                        if (req.body.date_end !== undefined && req.body.date_end !== ''){
                            journey.date_end = req.body.date_end;
                        }
                        if (req.body.title !== undefined && req.body.title !== ''){
                            journey.title = req.body.title;
                        }
                        if (req.body.description !== undefined && req.body.description !== ''){
                            journey.description = req.body.description;
                        }
                        if (req.body.background_image_id !== undefined && req.body.background_image_id !== ''){
                            journey.background_image_id = req.body.background_image_id;
                        }
                        journey.save((err) => {
                                    if (err) {
                                        res.status(500).json({message: 'Internal Server Error'})
                                        console.log(err);
                                    };
                                    console.log('Journey successfully updated!');
                                    res.status(201).json({ message:'Journey updated', details: 'Journey successfully updated', journey })
                                });
                    }
                });
            }
        });
    },
    getJourneyImagesZipUrl: (req, res) => {
        const id_journey = req.params.id;

        Image.find({ id_journey }, (err, images) => {
            if (err) {
                res.status(500).json({message: 'Internal Server Error'})
                console.log(err);
            };
            if(!images){
                res.status(404).json({message: "There is no images with this ID of journey"});
            } else {
                const public_ids = images.map(image => image._id);
                const options = { public_ids, resource_type: 'image'};
    
                cloudinary.v2.uploader.create_zip(options, (error, result) => {
                    if (error) {
                        res.status(500).json({message: 'Internal Server Error'})
                        console.log(error);
                    };
    
                    const url = result.url;
                    res.status(200).json({ message: 'Success', url });
                });
            }
        });
    },
}