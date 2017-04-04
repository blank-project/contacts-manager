var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Phone;
  // TODO
const TEL_REGEX = / /i;

// https://en.wikipedia.org/wiki/VCard

var schema = new Schema({
  value : { type: String },
  type : {type : String}
}, { _id : false });

Phone = mongoose.model('Phone', schema);
Phone.schema = schema;

module.exports = Phone;
