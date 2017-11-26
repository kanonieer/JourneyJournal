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
            if (err) throw err;

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
                            if (req.body.id_disc == undefined) {
                            res.status(401).json({message:"Disc is not set"});
                            console.log("Disc is not set");
                            } else {
                                if(req.body.description == undefined){
                                    req.status(401).json({message: "Description is not set"})
                                } else {
                                var journey = new Journey({
                                    date_start: req.body.date_start,
                                    date_end:   req.body.date_end,
                                    id_user:    user._id,
                                    title:      req.body.title,
                                    id_disc:    req.body.id_disc,
                                    description:req.body.description
                                });
                                journey.save((err) => {
                                    if (err) throw err;
                                    
                                    console.log('Journey successfully added!');
                                }); 
                                
                                res.status(201).json({ message:'Journey added', details: 'Journey successfully added'})
                                }
                            }
                        }
                    }
                }
            }
        })
    },
    getJourneys: (req, res) => {
        console.log(req.user);
        User.findOne({ _id : req.user._doc._id}, (err, user) => {
            if (err) throw err;

            if (!user) {
                res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
                console.log('User not found!');                 
            } else {
                Journey.find({ id_user : user._id }, (err, journeys) => {
                    if (err) throw err;

                    res.status(200).json(journeys);
                }).select('-id_disc');
            }
        });
    },

    getJourneyById: (req, res) => {
        Journey.findOne({ _id : req.params.id}, (err, journey) => {
            if (err) throw err;

            if (!journey) {
                res.status(404).json({ message:'Not Found', details: 'There is no journey with this ID' });
                console.log('Journey not found!');                 
            } else {
                res.status(200).json(journey);
            }
        }).select('-id_disc');;
    },

    deleteJourneyById: (req, res) => {///dodac jeszcze warunki sprawdzajace istnienie image i podrozy
        Image.find({id_journey : req.params.id}, (err, images) => {
            if (err) throw err;

            if (!images){
                res.status(404).json({message: "There is no Images with this ID of Journey"});
                console.log("Images not found");
            } else {
                for (var i=0; i<images.length; i++){
                    Image.findOneAndRemove({_id : images[i]._id}, (err) => {
                        if(err) throw err;
                    });
                    cloudinary.uploader.destroy(images[i]._id, function(result) { console.log(result) });
                }
                Journey.findOneAndRemove({_id : req.params.id}, function(err) {
                    if (err) throw err;
                        res.status(200).json("Journey with images successfully deleted");
                });
            }
        });
    },
    editJourney: (req, res) => {
        User.findOne({ _id : req.user._doc._id}, (err, user) => {
            if (err) throw err;

            if (!user) {
                res.status(404).json({message: "There is no user with this ID"});
                console.log("User not found!");
            } else {
                Journey.findOne({ _id : req.params.id}, (err, journey) => {
                    if (err) throw err;
                    if (!journey){
                        res.status(404).json({message: "There is no journey with this ID"});
                        console.log("Journey not found!");
                    } else {
                        if (req.body.form.date_start != undefined){
                            journey.date_start = req.body.form.date_start
                        }
                        if (req.body.form.date_end != undefined){
                            journey.date_end = req.body.form.date_end
                        }
                        if (req.body.form.title != undefined){
                            journey.title = req.body.form.title
                        }
                        if (req.body.form.description != undefined){
                            journey.description = req.body.form.description
                        }
                        console.log(journey);
                        journey.save((err) => {
                                    if (err) throw err;
                                    
                                    console.log('Journey successfully updated!');
                                });
                        res.status(201).json({ message:'Journey updated', details: 'Journey successfully updated'})
                    }
                });
            }
        });
    }
}