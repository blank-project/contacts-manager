var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Address;

// https://en.wikipedia.org/wiki/VCard

var schema = new Schema({
  street : { type: String },
  city : {type : String},
  code : {type : String},
  country : {type : String},
  number : { type: String }
});

Address = mongoose.model('Address', schema);
Address.schema = schema;

module.exports = Address;
