var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Phone = require('./Phone')
  , Address = require('./Address')
  , Email = require('./Email');


// https://en.wikipedia.org/wiki/VCard

// Base Schema
var schema = new Schema({
  name : {
    last : { type: String },
    first : {type : String, required : true},
    prefix : {type : String},
    suffix : {type : String}
  },
  emails : [Email.schema],
  phones : [Phone.schema],
  addresses : [Address.schema]
}, {
  collection : 'contacts',
  timestamps: {
    createdAt : 'meta.creationDate',
    updatedAt : 'meta.modificationDate'
  }
});

// Add Virtuals
schema.virtual('fullName').
  get(function () {
    var name = this.name || {}, fullName = name.first;
    if (name.last) {
      fullName += ' ' + name.last;
    }
    if (name.prefix) {
      fullName = name.prefix + fullName;
    }
    if (name.suffix) {
      fullName += ', ' + name.suffix;
    }
    return fullName;
  }).
  set(function(v) {
    // TODO Enhance for suffix.
    this.name = this.name || {};
    var idx =  v.indexOf(' ');
    if (idx == -1) {
      this.name.first = v;
    } else {
      this.name.first = v.substr(0, idx);
      this.name.last = v.substr(idx + 1);
    }
  });

schema.virtual('address').get(function() {
  var addr = this.addresses;
  if (addr && addr.length > 0) {
    return addr[0];
  }
  return null;
});

schema.virtual('email').get(function() {
  var mails = this.emails;
  if (mails && mails.length > 0) {
    return mails[0].value;
  }
  return null;
}).set(function(v) {
  var mails = this.emails;
  if (!mails) {
    mails = [];
  }
  if (mails.length == 0){
    mails.push(new Email());
  }
  mails[0].value = v;
});

schema.virtual('phone').get(function() {
  var phones = this.phones;
  if (phones && phones.length > 0) {
    return phones[0].value;
  }
  return null;
}).set(function(v) {
  var phones = this.phones;
  if (!phones) {
    phones = [];
  }
  if (phones.length == 0){
    phones.push(new Phone());
  }
  phones[0].value = v;
});

var Contact = mongoose.model('Contact', schema);

module.exports = Contact;
