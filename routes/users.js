var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bodyParser =require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors')
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) => {
  User.find({}).then((user) => {
    res.statusCode = 200
    res.setHeader("Content_Type","application/json")
    res.json(user);
  },(err) => next(err))
  
  
})
// ,
// cors.corsWithOptions,
router.post('/signup', (req,res,next) => {
  User.register(new User({username : req.body.username}), req.body.password , (err,user) => { 
    if(err){
      res.statusCode = 500
      res.setHeader('Content_Type','application/json')
      res.json({err:err})
    }
    else{
        if(req.body.firstname){
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname){
          user.lastname = req.body.lastname
        }
        user.save((err,user) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content_Type','application/json')
            res.json({err});
            return;
          }
            passport.authenticate('local')(req,res, () => {
            res.statusCode = 200
            res.setHeader('Content_Type','application/json')
            res.json({status:' Registration Successful', success:true})
          });
        });
        
    }
  
  });
    
  
});



router.post('/login',passport.authenticate('local'), (req,res,next) => {

  var token = authenticate.getToken({_id:req.user._id});
  res.statusCode = 200
  res.setHeader('Content_Type','application/json')
  res.json({status:'You are Successfully logged In', token:token,success:true})

});

router.get('/logout',cors.corsWithOptions,(req,res,next) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('new-session');
    res.redirect('/');

  } 
  else{
    err = new Error('Client Do Not Provide Right Username and password in Req');
    
    err.status = 401
    next(err);    
  } 
});
module.exports = router;
