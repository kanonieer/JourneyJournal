const Journey = require('./../models/journey');
const User = require('./../models/user'); 

module.exports={
    CreateJourney: (req,res)=>{
        User.findOne({_id:req.user._doc._id},(err,user)=>{
            if(err) throw err;

            if(!user){
                res.status(404).json({ message:'Not Found', details: 'There is no user with this ID' });
                console.log('User not found!'); 
            }
            if(user){
                if(req.body.date_start==undefined){
                    res.status(401).json({message:"Start date is not set"});
                    console.log("Start date is not set");
                }else{
                    if(req.body.date_end==undefined){
                        res.status(401).json({message:"End date is not set"});
                        console.log("End date is not set");
                    }else{
                        if(req.body.title==undefined){
                            res.status(401).json({message:"Title is not set"});
                            console.log("Title is not set");
                        }else{
                            if(req.body.id_disc==undefined){
                            res.status(401).json({message:"Disc is not set"});
                            console.log("Disc is not set");
                            }else{
                                var journey = new Journey({
                                    date_start: req.body.date_start,
                                    date_end:   req.body.date_end,
                                    id_user:    user._id,
                                    title:      req.body.title,
                                    id_disc:    req.body.id_disc
                                });
                                journey.save((err) => {
                                    if (err) throw err;
                                    
                                    console.log('Journey successfully added!');
                                }); 
                            }
                        }
                    }
                }
            }

        })
    }
}