const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // this will fulfile support for session in user
passport.deserializeUser(User.deserializeUser());