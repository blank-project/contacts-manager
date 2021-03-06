var conf = require('./config').db,
    mongoose = require('mongoose');

// Exports the function building the db.
module.exports = function() {

  // Connection URL
  var url = 'mongodb://';
 
  if (conf.user && conf.password) {
    url += conf.user+ ':' + conf.password + '@';
  }
  url += conf.host;
  if(conf.port) {
    url += ':' + conf.port
  } 
  url += '/' + conf.database;
  if (conf.opts) {
    url += '?' + conf.opts;
  }

  console.log('Connecting to ' + conf.database);

  // Set default Promise
  mongoose.Promise = global.Promise;

  var options = conf.options || {};
  options.useMongoClient = true;

  return mongoose.connect(url, conf.options);
};
