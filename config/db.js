var conf = require('./config').db,
    co = require('co'),
    MongoClient = require('mongodb').MongoClient;

// Exports the function building the db.
module.exports = co.wrap(function*() {
  // Connection URL
  var url = conf.url;
  delete conf.url;

  // Use connect method to connect to the Server
  var db = yield MongoClient.connect(url, conf);
  //
  return db;
});
