var express = require('express'),
  config = require('./config/config'),
  path = require('path');

var app = express();

module.exports = require('./config/express')(app, config);

// Do not start if we are required by another file.
if (module.parent)  {
  return;
}

var connect = require('./config/db');

connect().then(db => {
  // Store db connection in global.
  global.db = db;

  // Starts server
  app.listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
  });
}, err => {
  console.log('Err ' + err.stack);
});
