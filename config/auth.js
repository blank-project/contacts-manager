// Auth conf
var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    // Really not secure but hey, we'll implement something later.
    credentials = {
      username : 'bccontacts',
      password : 't€stc0ntact$'
    }, configure;

/**
* Configure the authentication mechanism and return the passport middleware used.
*/
configure = function() {
  var checker = function(username, password, done) {
    console.log("Authenticating " + username + " " + password);
    if (credentials.username === username && credentials.password === password) {
      return done(null, credentials);
    }
    return done(null, false);
  }, basicAuth = new BasicStrategy(checker);
  passport.use(basicAuth);
  return passport;
};

module.exports = configure;
