var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Phone = require('./Phone')
  , Email = require('./Email')
//  , Profile = require('./Profile')
  , passportLocalMongoose = require('passport-local-mongoose');

const Permissions = require('./Permissions');

// Base Schema
// TODO Factor with Contact as BaseEntity ?
// TODO Using ES6 Classes as definition ?
var schema = new Schema({
  name : {
    last : { type: String , trim : true },
    first : {type : String, required : true, trim : true }
  },
  organization : {type : String, trim : true },
  title : {type : String, trim : true },
  emails : [Email.schema],
  phones : [Phone.schema],
  // profile : Profile.schema,
  permissions : [{type : String, trim : true }],
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

//
schema.plugin(passportLocalMongoose, {
  saltField : 'meta.salt',
  hashField : 'password',
  attemptsField : 'meta.attempts',
  lastLoginField : 'meta.lastLogin',
  populateFields : 'profile',
  usernameUnique : true,
  findByUsername: function(model, queryParameters) {
    // Add additional query parameter - AND condition - active: true
    queryParameters["meta.disabled"] = null;
    return model.findOne(queryParameters).populate('profile');
  },
  errorMessages : {
    MissingPasswordError : 'Mot de passe manquant',
    AttemptTooSoonError : 'Trop d\'essais manqué, veuillez ré-essayer plus tard',
    TooManyAttemptsError : 'Trop d\'essais manqué, veuillez ré-essayer plus tard',
    NoSaltValueStoredError : 'Authentication not possible. No salt value stored',
    IncorrectPasswordError : 'Nom d\'utilisateur ou mot de passe incorrect',
    IncorrectUsernameError : 'Nom d\'utilisateur ou mot de passe incorrect',
    MissingUsernameError : 'Nom d\'utilisateur manquant',
    UserExistsError : 'Un utilisateur avec ce nom existe déja'
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

schema.method('isPermitted', function() {
  var claim = this._claim || (this._claim = Permissions.considerPermissions([].concat(this.permissions)));
  return claim.isPermitted(arguments);
});

schema.method('ban', function(ban) {
  var meta = this.meta || (this.meta = {});
  meta.disabled = ban === false ? null : new Date();
});

/*
schema.virtual('permissions').get(function() {
  var profile = this.profile;
  if (!profile || !profile.permissions) {
    return [];
  }
  return profile.permissions;
});
*/

var User = mongoose.model('User', schema);

module.exports = User;
