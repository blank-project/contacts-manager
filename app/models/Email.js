var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Email;
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

// https://en.wikipedia.org/wiki/VCard

var schema = new Schema({
  value : { type: String, match : EMAIL_REGEX },
  type : {type : String, trim : true }
}, { _id : false });

Email = mongoose.model('Email', schema);
Email.schema = schema;

module.exports = Email;
