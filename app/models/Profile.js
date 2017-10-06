var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Profile;

// Base Schema
var schema = new Schema({
  name : { type: String, required : true, trim : true },
  roles : [{ type: String, trim : true }]
}, {
  collection : 'profiles',
  timestamps: {
    createdAt : 'meta.creationDate',
    updatedAt : 'meta.modificationDate'
  }
});

Profile = mongoose.model('Profile', schema);
Profile.schema = schema;

module.exports = Profile;
