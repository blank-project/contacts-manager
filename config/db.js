var conf = require('./config').db,
    mongoose = require('mongoose');

// Exports the function building the db.
module.exports = function() {

  // Connection URL
  var url = 'mongodb://' + conf.host + ':' + conf.port + '/' + conf.database;

  // Set default Promise
  mongoose.Promise = global.Promise;

  return mongoose.connect(url, conf.options);
};
