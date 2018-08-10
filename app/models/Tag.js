const mongoose = require('mongoose')
 , invert = require('invert-color')
 , Schema = mongoose.Schema

/**
 * A RegEx for Labels.
 */
const LABEL_REGEX = /[^@#]+/i;
/**
 * A RegEx matching 3 and 6 digits Hex String.
 */
const COLOR_REGEX = /#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/

// Base Schema
var schema = new Schema({
  name : { type: String, match : LABEL_REGEX, trim : true },
  color : { type: String, match : COLOR_REGEX, default : '#000000' }
}, {
  collection : 'tags',
  timestamps: {
    createdAt : 'meta.creationDate',
    updatedAt : 'meta.modificationDate'
  }
});

schema.virtual('textColor').get(function () {
  return invert(this.color, true);
});

const Tag = mongoose.model('Tag', schema);
Tag.schema = schema;

module.exports = Tag;
