var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var fileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var route = require('./routes/route')
var leaderRoute = require('./routes/leaderRoute')
var promotionRoute = require('./routes/promotionRoute')
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const promotion = require('./models/promotion');
const Leader = require('./models/leader');

const url = config.mongoUrl;
const mongo = mongoose.connect(url);

mongo.then((db) => {
  console.log('Connected TO DB!')
}, (err) => console.log(err));
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(''));

// app.use(session({
//   name: 'new-session',
//   secret:'13458-hgjfd-uytru-84645',
//   saveUninitialized:false,
//   resave:false,
//   store: new fileStore()
// }));
app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// function auth(req,res,next) {
//   console.log(req.session);

//   if(!req.user){
//       err = new Error('Client Do Not Provide Header in Req');
//       err.status = 401
//       return next(err);
//     }
//   else{
//     next();
    
//   }


  

// }
// // express session enables us to track user activity

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',route)
app.use('/leaders',leaderRoute);
app.use('/promos',promotionRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
