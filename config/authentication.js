// Auth conf
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    LocalStrategy = require('passport-local').Strategy,
    User = require('../app/models/User'),
    configure;

/**
* Configure the authentication mechanism and return the passport middleware used.
*/
configure = function() {
  // use static authenticate method of model in LocalStrategy
  passport.use(User.createStrategy());

  // use static serialize and deserialize of model for passport session support
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  return passport;
};

module.exports = configure();
