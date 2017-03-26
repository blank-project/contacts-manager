var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Phone;
const TEL_REGEX = / /i;

// https://en.wikipedia.org/wiki/VCard

var schema = new Schema({
  value : { type: String },
  type : {type : String}
});

Phone = mongoose.model('Phone', schema);
Phone.schema = schema;

module.exports = Phone;
