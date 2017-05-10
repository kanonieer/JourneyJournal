const User = require('./../models/user'); 

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
    }
}