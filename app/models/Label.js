var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Label;

  const LABEL_REGEX = /[^@#]+/i;

// Base Schema
var schema = new Schema({
  name : { type: String, match : LABEL_REGEX },
  color : { type: String }
}, {
  collection : 'labels',
  timestamps: {
    createdAt : 'meta.creationDate',
    updatedAt : 'meta.modificationDate'
  }
});

Label = mongoose.model('Label', schema);
Label.schema = schema;

module.exports = Label;
