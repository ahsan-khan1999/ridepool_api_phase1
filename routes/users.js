var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bodyParser =require('body-parser');


router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next) => {
  User.findOne({username : req.body.username})
  .then((user) => {
    if(user != null){
      err =new Error('User Already Exists', req.body.username);
      err.status = 403
      return next(err);
    }
    else{
      return User.create({
        username:req.body.username,
        password:req.body.password
      });
    }
  },(err) => next(err)).then((user) => {
    res.statusCode = 200
    res.setHeader('Content_Type','application/json')
    res.json(user)
  },(err) => next(err))
});

router.post('/login', (req,res,next) => {
  if(!req.session.user){
    var authHeader = req.headers.authorization;

    if(!authHeader){
      err = new Error('Client Do Not Provide Header in Req');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401
      next(err);
    }
    else{
      var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

      User.findOne({username : auth[0]})
      .then((user) => {
        if(user === null){
      err = new Error('Username and password Do Not exists');
      err.status = 401
      next(err);
        
        }
        else if(user.password !== auth[1]){
          err = new Error('password Do Not match');
      err.status = 401
      next(err);
        }
        else if(user.username === auth[0] && user.password === auth[1]){
          req.session.user = 'authenticated'
          res.statusCode = 200;
          res.setHeader('Content_Type', 'text/plain')
          res.end('you are authenticated');
        }
      else{
      err = new Error('Client Do Not Provide Right Username and password in Req');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401
      next(err);
      }
    },(err) => next(err));
    }

  }
  else{
    res.statusCode = 200;
  res.setHeader('Content_Type', 'text/plain')
  res.end('you are already  authenticated');
  }

})

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
