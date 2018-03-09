var conf = require('./config').db,
    mongoose = require('mongoose');

// Exports the function building the db.
module.exports = function() {

  // Connection URL
  var url = 'mongodb://' + conf.host + ':' + conf.port + '/' + conf.database;

  console.log('Connecting to ' + conf.database);

  // Set default Promise
  mongoose.Promise = global.Promise;

  var options = conf.options || {};
  options.useMongoClient = true;

  return mongoose.connect(url, conf.options);
};
