const expressJwt    = require('express-jwt');
const jwt           = require('jsonwebtoken');

module.exports = {
    authenticate : expressJwt(
    {secret: 'server secret temp',
     getToken: function (req) {
        var token = req.body.access_token || req.query.access_token || req.headers['x-access-token'];
        if (token) {
            return token;
        } 
            return null;
    }}
    ),

    generateToken : (req, res, next) => {
        req.token = jwt.sign(req.user,'server secret temp',{expiresIn:6000*1200});
        next();
    }
}