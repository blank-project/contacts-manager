var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Tag;

  const LABEL_REGEX = /[^@#]+/i;

// Base Schema
var schema = new Schema({
  name : { type: String, match : LABEL_REGEX },
  color : { type: String }
}, {
  collection : 'tags',
  timestamps: {
    createdAt : 'meta.creationDate',
    updatedAt : 'meta.modificationDate'
  }
});

Tag = mongoose.model('Tag', schema);
Tag.schema = schema;

module.exports = Tag;
