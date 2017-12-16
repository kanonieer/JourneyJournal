const User          = require('./../models/user');
const Journey       = require('./../models/journey');
const Image         = require('./../models/image');
const node_dropbox  = require('node-dropbox');
const config        = require('./../config/auth');
const jwt           = require('jsonwebtoken');
const cloudinary  = require('cloudinary');
const CloudinaryConfig = require('./../config/cloudinary')

cloudinary.config({ 
  cloud_name: CloudinaryConfig.cloud_name, 
  api_key: CloudinaryConfig.api_key, 
  api_secret: CloudinaryConfig.api_secret
});

module.exports = {
    changeEmail: (req, res) => {
        if (req.params.id != req.user._doc._id) {
            res.status(403).json({ message: "You have no access to change mail for user with this ID" });
        }
        else {
            var oldEmail = req.body.form.oldEmail.toLowerCase(), newEmail = req.body.form.newEmail.toLowerCase();

            User.findOne({_id: req.params.id}, (err, user) => {
                if (err) throw err;
                
                if (!user) {
                res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
                console.log('User not found!');   
                }
                if (user) {
                    if (user.local.email == undefined){
                        res.status(401).json({ code: 401.1, message:'No Email Yet', details: 'This user did not set an email' });         
                            console.log('User email not set yet!');              
                    } else {
                        if (user.local.email != oldEmail ) {
                            res.status(401).json({ code: 401.2, message:'Invalid Email', details: 'Old email does not match' });    
                                console.log('User email invalid!');                   
                        } else{
                            User.findOne({'local.email': newEmail}, (err, anotherUser) => {
                                if (err) throw err;

                                if (anotherUser) {
                                    res.status(401).json({ code:401.3, message:'Email unavaliable', details: 'Another user already use this email'});  
                                    console.log('Email already taken!');
                                } else{
                                    user.local.email = newEmail;
                                    user.save((err) => {
                                        if (err) throw err;

                                        console.log('User email successfully updated!');
                                    }); 
                                    res.status(200).json({ message:'Email changed', details: 'User email successfully changed'});                                 
                                }
                            });
                        }
                    }
                }
            });
        }
    },
    changePassword: (req, res) => {
        if (req.params.id != req.user._doc._id) {
            res.status(403).json({ message: "You have no access to change password for user with this ID" });
        }
        else {
            var oldPassword = req.body.form.oldPassword, newPassword = req.body.form.newPassword;

            User.findOne({_id: req.params.id}, (err, user) => {
                if (err) throw err;
                
                if (!user) {
                res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
                console.log('User not found!');   
                }
                if (user) {
                    if (!user.validPassword(oldPassword)) {
                        res.status(401).json({ code:401.1, message:'Wrong password', details: 'The old passwords do not match each other' });         
                            console.log('Wrong password!');              
                    } else{
                        user.local.password = user.generateHash(newPassword);
                        user.save((err) => {
                            if (err) throw err;

                            console.log('User password successfully updated!');
                        }); 
                        res.status(200).json({ message:'Password changed', details: 'User password successfully changed'});                            
                    }
                }
            });
        }
    },
    authWithFacebook: (req, res) => {
        const facebook_user_id = req.body.facebook_user_id;
        const facebook_token = req.body.facebook_token;

        User.findOne({ 'facebook.id': facebook_user_id }, (err, user) => {
            if (err) throw err;

            if (!user) {
                let newUser = new User();

                newUser.facebook.id = facebook_user_id;
                newUser.facebook.token = facebook_token;

                newUser.save(err => {
                    if (err) throw err;
                    
                    console.log('No user before, now created');
                    const access_token = jwt.sign(newUser, 'server secret temp', { expiresIn: 6000*1200 });
                    const user_id = newUser._id;

                    res.status(201).json({ 
                        message: 'Account created', 
                        details: 'User account created with Facebook auth',
                        data: { access_token, user_id }
                    });
                }); 
            } else {
                console.log('Authenticating with Facebook');
                const access_token = jwt.sign(user, 'server secret temp', { expiresIn: 6000*120 });
                const user_id = user._id;

                res.status(201).json({
                    message: 'Success',
                    details: 'Successfully authenticated with facebook',
                    data: { access_token, user_id }
                });
            }
        });
    },
    addFacebookAuth: (req, res) => {
        const user_id = req.params.id;
        const facebook_user_id = req.body.facebook_user_id;
        const facebook_token = req.body.facebook_token;


        User.findOne({ _id: user_id }, (err, user) => {
            if (err) throw err;

            if (!user) {
                res.status(404).json({ message:'Error', details: 'User not found'}); 
            } else {
                if (!user.facebook.id || user.facebook.id === '') {
                    User.findOne({ 'facebook.id': facebook_user_id }, (err, fbUser) => {
                        if (err) throw err;

                        if (!fbUser) {
                            user.facebook.id = facebook_user_id;
                            user.facebook.token = facebook_token;

                            user.save(err => {
                                if (err) throw err;

                                res.status(201).json({
                                    message: 'Success',
                                    details: 'Facebook account successfully added',
                                    data: { user }
                                });
                            });
                        } else {
                            res.status(401).json({
                                message: 'Unauthorized',
                                details: 'There is already an user using provided Facebook account'
                            }); 
                        }
                    });
                } else {
                    res.status(401).json({
                        message: 'Unauthorized',
                        details: 'User already have an facebook added'
                    }); 
                }
            }
        });
    },
    // authWithFacebook: (req, res) => {
    //     const user_id = req.body.user_id;
    //     const facebook_user_id = req.body.facebook_user_id;
    //     const token = req.body.token;

    //     User.findOne({ 'facebook.id': facebook_user_id }, (err, facebookUser) => {
    //         if (err) throw err;

    //         User.findOne({ _id: user_id }, (err, user) => {
    //             if (err) throw err;
    
    //             if (!user) {
    //                 if(!facebookUser) {
    //                     let newUser = new User();

    //                     newUser.facebook.id = facebook_user_id;
    //                     newUser.facebook.token = token;
    //                     newUser.save(err => {
    //                         if (err) throw err;
                            
    //                         console.log('No user before, now created');
    //                         const access_token = jwt.sign(newUser, 'server secret temp', { expiresIn: 6000*120 });
    //                         const payload_user_id = newUser._id;
    //                         res.status(201).json({ 
    //                             message: 'Account created', 
    //                             details: 'User account created with Facebook auth',
    //                             data: { access_token, payload_user_id }
    //                         });
    //                     }); 
    //                 } else {
    //                     console.log('Facebook authenticated');
    //                     console.log('First case');
    //                     const access_token = jwt.sign(facebookUser, 'server secret temp', { expiresIn: 6000*120 });
    //                     const payload_user_id = facebookUser._id;
    //                     res.status(201).json({
    //                         message: 'Success',
    //                         details: 'Successfully authenticated with facebook',
    //                         data: { access_token, payload_user_id }
    //                     });
    //                 }
    //             } else {
    //                 if (!facebookUser) {
    //                     if (!user.facebook) {
    //                         user.facebook.id = facebook_user_id;
    //                         user.facebook.token = token;
        
    //                         user.save(err => {
    //                             if (err) throw err;
        
    //                             console.log('No facebook before, now added');
    //                             const access_token = jwt.sign(user, 'server secret temp', { expiresIn: 6000*120 });
    //                             const payload_user_id = user._id;
    //                             res.status(201).json({
    //                                 message: 'Facebook added',
    //                                 details: 'Facebook account successfully added',
    //                                 data: { access_token, payload_user_id }
    //                             });
    //                         })
    //                     } else {
    //                         console.log('Facebook authenticated');
    //                         const access_token = jwt.sign(user, 'server secret temp', { expiresIn: 6000*120 });
    //                         const payload_user_id = user._id;
    //                         res.status(201).json({
    //                             message: 'Success',
    //                             details: 'Successfully authenticated with facebook',
    //                             data: { access_token, payload_user_id }
    //                         });
    //                     }
    //                 } else {

    //                     console.log('Facebook already used');
    //                     res.status(409).json({ message : 'Unsuccessful', details: 'Provided facebook account already in use'});
    //                 }
    //             }
    //         });
    //     });
    // },
    deleteUser : (req, res) => {
        if(req.params.id != req.user._doc._id) {
            res.status(403).json({ message: "You have no access to delete user with this ID" });
        }
        else {
            User.findOne({_id : req.params.id}, (err, user) => {
                if (err) throw err;

                if (!user) {
                    res.status(404).json({ message: "There is no user with this ID" });
                } else {
                    Journey.find({ id_user : req.params.id }, (err, journeys) => {
                        if (err) throw err;
                        
                        if (!journeys) {
                            res.status(404).json({ message: "There are no journeys with this ID of user" });
                        } else {
                            for (var i = 0; i < journeys.length; i++) {
                                Image.find({ id_journey : journeys[i]._id }, (err, images) => {
                                    if (err) throw err;
                                    
                                    if (!images) {
                                        res.status(404).json({ message: "There is no images with this ID of journey" })
                                    } else {
                                        for (var j = 0; j < images.length; j++) {
                                            Image.findOneAndRemove({ _id : images[j]._id }, (err) => {
                                                if (err) throw err;
                                            });
                                            cloudinary.uploader.destroy(images[j]._id, function(result) { console.log(result) });
                                        }
                                    }
                                });
                                Journey.findOneAndRemove({ _id : journeys[i]._id }, (err) => {
                                    if (err) throw err;
                                });
                            }
                        }
                    });
                    User.findOneAndRemove({ _id : req.params.id }, (err) => {
                        if (err) throw err;
                    });
                }
                
            });
            res.status(200).json({ message: "Success", details: "Successfully deleted user" });
        }
    },

    saveToLibrary : (req, res) => {
        if(req.params.id != req.user._doc._id) {
            res.status(403).json({ message: "You have no access to delete user with this ID" });
        } 
        else {
            User.find({ _id : req.params.id }, (err, user) => {
                if (err) throw err;

                if(!user) {
                    res.status(404).json({ message: "There is no user with this ID" });
                } else {
                    user.saveToLibrary = req.body.saveToLibrary
                    
                    user.save((err) => {
                        if (err) throw err;

                        console.log('User password successfully updated!');
                    });
                    res.status(201).json({ message:'saveToLibrary changed', details: 'User saveToLibrary field successfully changed'});
                }
            });
        }       
    }
}