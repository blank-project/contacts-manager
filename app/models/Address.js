var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Address;

// https://en.wikipedia.org/wiki/VCard

var schema = new Schema({
  street : { type: String, trim : true },
  city : {type : String, trim : true },
  code : {type : String, trim : true },
  country : {type : String, trim : true },
  number : { type: String, trim : true }
}, { _id: false });

schema.methods.format = function() {
  var fmt = '';
  fmt += (this.number ? this.number + ' ' : '');
  fmt += (this.street ? this.street + ' ' : '');
  fmt += (this.code ? this.code + ' ' : '');
  fmt += (this.city ? this.city + ' ' : '');
  fmt += (this.country ? this.country : '');
  return fmt;
};

Address = mongoose.model('Address', schema);
Address.schema = schema;

module.exports = Address;
