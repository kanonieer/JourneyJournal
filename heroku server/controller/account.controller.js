const User          = require('./../models/user'); 
const node_dropbox  = require('node-dropbox');
const config        = require('./../config/auth');
const jwt           = require('jsonwebtoken');

module.exports = {
    changeEmail: (req, res) => {
        var oldEmail = req.body.form.oldEmail, newEmail = req.body.form.newEmail;

        User.findOne({_id: req.user._doc._id}, (err, user) => {
            if (err) throw err;
            
            if (!user) {
            res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
            console.log('User not found!');   
            }
            if (user) {
                if (user.local.email == undefined){
                    res.status(401).json({ code: 401.1, message:'No Email Yet', details: 'This user did not set an email' });         
                        console.log('User email not set yet!');              
                } else{
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
                                res.status(201).json({ message:'Email changed', details: 'User email successfully changed'});                                 
                            }
                        });
                    }
                }
            }
        });
    },
    changePassword: (req, res) => {
        var oldPassword = req.body.form.oldPassword, newPassword = req.body.form.newPassword;

        User.findOne({_id: req.user._doc._id}, (err, user) => {
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
                    res.status(201).json({ message:'Password changed', details: 'User password successfully changed'});                            
                }
            }
        });
    },
    
    authWithFacebook: (req, res) => {
        const user_id = req.body.user_id;
        const facebook_user_id = req.body.facebook_user_id;
        const token = req.body.token;

        User.findOne({ 'facebook.id': facebook_user_id }, (err, facebookUser) => {
            if (err) throw err;

            User.findOne({ _id: user_id }, (err, user) => {
                if (err) throw err;
    
                if (!user) {
                    if(!facebookUser) {
                        let newUser = new User();

                        newUser.facebook.id = facebook_user_id;
                        newUser.facebook.token = token;
                        newUser.save(err => {
                            if (err) throw err;
                            
                            console.log('No user before, now created');
                            const access_token = jwt.sign(newUser, 'server secret temp', { expiresIn: 6000*120 });
                            const payload_user_id = newUser._id;
                            res.status(201).json({ 
                                message: 'Account created', 
                                details: 'User account created with Facebook auth',
                                data: { access_token, payload_user_id }
                            });
                        }); 
                    } else {
                        console.log('Facebook authenticated');
                        console.log('First case');
                        const access_token = jwt.sign(facebookUser, 'server secret temp', { expiresIn: 6000*120 });
                        const payload_user_id = facebookUser._id;
                        res.status(201).json({
                            message: 'Success',
                            details: 'Successfully authenticated with facebook',
                            data: { access_token, payload_user_id }
                        });
                    }
                } else {
                    if (!facebookUser) {
                        if (!user.facebook) {
                            user.facebook.id = facebook_user_id;
                            user.facebook.token = token;
        
                            user.save(err => {
                                if (err) throw err;
        
                                console.log('No facebook before, now added');
                                const access_token = jwt.sign(user, 'server secret temp', { expiresIn: 6000*120 });
                                const payload_user_id = user._id;
                                res.status(201).json({
                                    message: 'Facebook added',
                                    details: 'Facebook account successfully added',
                                    data: { access_token, payload_user_id }
                                });
                            })
                        } else {
                            console.log('Facebook authenticated');
                            const access_token = jwt.sign(user, 'server secret temp', { expiresIn: 6000*120 });
                            const payload_user_id = user._id;
                            res.status(201).json({
                                message: 'Success',
                                details: 'Successfully authenticated with facebook',
                                data: { access_token, payload_user_id }
                            });
                        }
                    } else {

                        console.log('Facebook already used');
                        res.status(409).json({ message : 'Unsuccessful', details: 'Provided facebook account already in use'});
                    }
                }
            });
        });
    },
    addDropbox: (req, user_id, res) => {
        node_dropbox.AccessToken(config.dropboxAuth.key, config.dropboxAuth.secret, req.query.code, config.dropboxAuth.callbackURL, (err, body) => {
            if (err) throw err;
            console.log(body);
            if (!body.access_token) {
                res.redirect(config.dropboxAuth.redirectURL+'?code='+401.1);
                console.log('No access token provided!');
            } else {
                User.findOne({'dropbox.access_token' : body.access_token}, (err, anotherUser) => {
                    if (err) throw err;

                    if (anotherUser) {
                        res.redirect(config.dropboxAuth.redirectURL+'?code='+401.3);
                        console.log('Email already taken!');                    
                    } else {
                        console.log(user_id);
                        if (!user_id) {
                            res.redirect(config.dropboxAuth.redirectURL+'?code='+401);
                            console.log('User not provided!');  
                        } else {
                            User.findOne({_id: user_id}, (err, user) => {
                                if (err) throw err;

                                if (!user) {
                                res.redirect(config.dropboxAuth.redirectURL+'?code='+404);
                                console.log('User not found!');   
                                }
                                if (user) {
                                    if (user.dropbox.access_token) {
                                        res.redirect(config.dropboxAuth.redirectURL+'?code='+401.2);
                                        console.log('User already have a dropbox account');                                  
                                    } else {
                                        user.dropbox.access_token = body.access_token;

                                        user.save((err) => {
                                            if (err) throw err;

                                            console.log('Dropbox account successfuly added');
                                        });
                                        res.redirect(config.dropboxAuth.redirectURL+'?code='+201);   
                                    }
                                }
                            });                              
                        }
                    }
                });
            }   
        })
    }
}