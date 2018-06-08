var Contact = require('../models/Contact')
, ObjectID = require('mongodb').ObjectID;

function getTrimmedValue(pInput) {
  if (!pInput) {
    return '';
  }
  return pInput.trim();
}

function escapeRegExp(pInput) {
  return pInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function startsWith(pInput, pFlags) {
  return new RegExp("^" + escapeRegExp(pInput), pFlags);
}

function buildTagsQueryItem(tag) {
  if (typeof tag == "string") {
    return ObjectID.createFromHexString(tag);
  }
  return tag;
}

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
      .skip(first)
      .limit(size)
      .exec();
  }

}

module.exports = ContactManager;
