// Auth conf
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    LocalStrategy = require('passport-local').Strategy,
    User = require('../app/models/User'),
    configureBasic,
    configureLocal;

/**
* Configure the authentication mechanism and return the passport middleware used.
*/
configureBasic = function() {
  var credentials, checker;
  // Really not secure but hey, we'll implement something later.
  credentials = {
    username : 'bccontacts',
    password : 't€stc0ntact$'
  },
  checker = function(username, password, done) {
    console.log("Authenticating " + username + " " + password);
    if (credentials.username === username && credentials.password === password) {
      return done(null, credentials);
    }
    return done(null, false);
  }, basicAuth = new BasicStrategy(checker);


  passport.use(basicAuth);
  return passport;
};

/**
* Configure the authentication mechanism and return the passport middleware used.
*/
configureLocal = function() {
  var checker = function(req, username, password, done) {
    console.log("[LocalStrategy] Authenticating " + username + " " + password);
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username },
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username ' + username);
          return done(null, false);
        }
        // User exists but wrong password, log the error
        // TODO

        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, user);
      }
    );
  };

  passport.use(new LocalStrategy({
    passReqToCallback : true
  }, checker));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  return passport;
};

module.exports = configureLocal();
