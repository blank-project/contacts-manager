var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Phone = require('./Phone')
  , Email = require('./Email');
// Base Schema
// TODO Factor with Contact as BaseEntity ?
// TODO Using ES6 Classes as definition ?
var schema = new Schema({
  username : {type : String, required : true, trim : true, unique : true },
/*  hash : {type : String, required : true, trim : true },
  name : {
    last : { type: String , trim : true },
    first : {type : String, required : true, trim : true }
  }, */
  organization : {type : String, trim : true },
  title : {type : String, trim : true },
  emails : [Email.schema],
  phones : [Phone.schema],
  meta : {
    disabled : { type : Date }
  }
}, {
  collection : 'users',
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

schema.virtual('email').get(function() {
  var mails = this.emails;
  if (mails && mails.length > 0) {
    return mails[0].value;
  }
  return null;
}).set(function(v) {
  var mails = this.emails;
  if (!mails) {
    this.emails = mails = [];
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

var User = mongoose.model('User', schema);

module.exports = User;
