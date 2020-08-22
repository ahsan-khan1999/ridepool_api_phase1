const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const config = require('./config');
const ExtractToken = require('passport-jwt').ExtractJwt;


exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // this will fulfile support for session in user
passport.deserializeUser(User.deserializeUser()); // this will add user in req obj req.user 


module.exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,{expiresIn:3600});

}

var options = {}
    options.jwtFromRequest = ExtractToken.fromAuthHeaderAsBearerToken();
    options.secretOrKey = config.secretKey; 


module.exports.jwtPassport = passport.use(new jwtStrategy(options,(jwt_payload,done) => {
    console.log('Jwt Payload is : ',jwt_payload);
    User.findOne({_id:jwt_payload._id}, (err,user) => {
        if(err){
            return done(err,false);
        }
        else if(user) {
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    });
}));

module.exports.verifyUser = passport.authenticate('jwt',{session:false});

module.exports.verifyAdmin = (req,res,next) => {
    if(req.user.admin === true){
        res.statusCode = 200;
        res.setHeader("Content_Type","application/json");
        next();
    }
    else{
        err = new Error("You are Unauthorize to Perform This Operation ")
        err.status = 403
        return next(err);
    }
}