var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bodyParser =require('body-parser');
var passport = require('passport');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next) => {
  User.register(new User({username : req.body.username}), req.body.password , (err,user) => { 
    if(err){
      res.statusCode = 500
      res.setHeader('Content_Type','application/json')
      res.json({err:err})
    }
    else{
        passport.authenticate('local')(req,res, () => {
        res.statusCode = 200
        res.setHeader('Content_Type','application/json')
        res.json({status:' Registration Successful', success:true})
      });
    }
  
  });
    
  
});

router.post('/login',passport.authenticate('local'), (req,res,next) => {
  res.statusCode = 200
  res.setHeader('Content_Type','application/json')
  res.json({status:'You are Successfully logged In', success:true})

});

router.get('/logout',(req,res,next) => {
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
