const Contact = require('../models/Contact')
    , ObjectID = require('mongodb').ObjectID;

/**
 * A RegExp that matches regex special chars.
 */
const REGEXP_ESCAPE_REGEXP = /[-\/\\^$*+?.()|[\]{}]/g;
/**
 * Pass this value as second parameter to String.prototype.replace
 * to prefix a match with "\", effectively esacping it.
 * Special value $& is a placeholder for the matched substring.
 */
const ESCAPED_MATCH = '\\$&';

/**
 * Shorthand function to trim a value.
 * @param {String} [pInput] a value.
 * @return the parameter, trimmed, or an empty String.
 */
function getTrimmedValue(pInput) {
  if (!pInput) {
    return '';
  }
  return pInput.trim();
}

/**
 * Escapes the RegExp special chars from the given String.
 * @param {String} pInput a value.
 * @return A string with its RegExp special chars escaped.
 */
function escapeRegExp(pInput) {
  return pInput.replace(REGEXP_ESCAPE_REGEXP, ESCAPED_MATCH);
}

/**
 * Converts the given value to a "Starts With" RegExp with given flags.
 * Example : given "test" and "i" as parameters, returns /^test/i
 * RegExp specials chars in the input are escaped.
 * @param {String} pInput a value.
 * @param {String} pFlags the Regexp Flags.
 * @return a RegExp matching Strings starting with pInput, with given flags.
 */
function startsWith(pInput, pFlags) {
  return new RegExp("^" + escapeRegExp(pInput), pFlags);
}

/**
 * Builds an item in the tags query.
 */
function buildTagsQueryItem(tag) {
  if (typeof tag == "string") {
    return ObjectID.createFromHexString(tag);
  }
  return tag;
}

/**
 * Buils the tags query part.
 */
function buildTagsQueryPart(tags, query) {
  // No Value provided
  if (typeof tags === 'undefined') {
    return;
  }
  // Search by all provided tags
  if (!Array.isArray(tags)) {
    // Wrap if needed
    tags = [tags];
  }
  if (tags.length != 0) {
    query.tags = { $all : tags.map(buildTagsQueryItem) };
  } else {
    query.tags = { $size : 0 };
  }
}

/**
 * A Manager class managing Contacts.
 */
class ContactManager {

  /**
   * Build a Query from the Request.
   @param req {Object}
   */
  buildQuery(req) {
    var query = {}, or = [];

    buildTagsQueryPart(req.tags, query);

    var search = getTrimmedValue(req.search);
    if (search) {
      query.$text = { $search: search };
    }

    var name = getTrimmedValue(req.name);
    if (name) {
      name = startsWith(name, 'i');
      or.push({ "name.first" : name});
      or.push({ "name.last" : name});
    }

    var zipCode = getTrimmedValue(req['address.code']);
    if (zipCode) {
      query.address = { code : zipCode };
    }

    var organization = getTrimmedValue(req.organization);
    if (organization) {
      query.organization = startsWith(organization, 'i');
    }

    if (or.length != 0) {
      query.$or = or;
    }
    return query;
  }

  /**
   * Finds all Contacts matching the given request.
   */
  find(req, options) {
    options = options || {};

    var query = this.buildQuery(req),
    first = options.first,
    size = options.size;

    if (!first || first < 0) {
      first = 0;
    }

    if (!size || size <= 0) {
      size = 20;
    }

    return Contact.find(query)
      .populate({
        path: 'tags',
        options: { sort: 'name'}
      })
      .sort("name.last")
      .skip(first)
      .limit(size)
      .exec();
  }

}

module.exports = ContactManager;
