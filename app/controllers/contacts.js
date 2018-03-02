var express = require('express')
, co = require('co')
, router = express.Router()
, ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
, ensureRequest = require('../../config/authorization').ensureRequest
, Contact = require('../models/Contact')
, Tag = require('../models/Tag')
// Export part
, conf = require('../../config/config')
, path = require('path')
, db = conf.db
, cwd = conf.root
, execFile = require('child_process').execFile
, scriptDir = path.join(cwd, 'scripts/')
, script = path.join(scriptDir, 'contacts-export.sh')
, exportsDir = path.join(cwd, 'data', 'downloads/')
, uuid = require('uuid/v1')
, fs = require('fs')
, EJSON = require('mongodb-extended-json')
, ObjectID = require('mongodb').ObjectID;

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/contacts', ensureLoggedIn('/login'), router);
};

function csvExport(req, res, next) {

  var filename = path.join(exportsDir, uuid())
    , options = {
    cwd : scriptDir,
    env : db
  }, query = EJSON.stringify(buildQuery(req));
  console.log('CSV Exports : ' + query);
  execFile(script, [ filename, query ], options, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);

    if (error) {
      next(error);
      return;
    }

    res.download(filename, "contacts-exports.csv", (err) => {
      err && console.log(err);

      fs.unlink(filename, (err) => {
        err && console.log(err);
      });
    });
  });

};

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
/**
 * Build a Query from the Request.
 */
function buildQuery(req) {
  var query = {}, input = req.query, or = [];
  // Search by all provided tags
  if (!input.tags) {
    input.tags = [];
  } else if (typeof input.tags == "string") {
    input.tags = [input.tags];
  }
  if (input.tags.length != 0) {
    let tagsId = [];
    input.tags.forEach(tag => {
      tagsId.push(ObjectID.createFromHexString(tag));
    });
    query.tags = { $all : tagsId };
  }

  var search = getTrimmedValue(input.search);
  if (search) {
    query.$text = { $search: search };
  }

  var name = getTrimmedValue(input.name);
  if (name) {
    name = startsWith(name, 'i');
    or.push({ "name.first" : name});
    or.push({ "name.last" : name});
  }

  var zipCode = getTrimmedValue(input['address.code']);
  if (zipCode) {
    query.address = { code : zipCode };
  }

  var organization = getTrimmedValue(input.organization);
  if (organization) {
    query.organization = startsWith(organization, 'i');
  }

  if (or.length != 0) {
    query.$or = or;
  }
  console.log(JSON.stringify(query));
  return query;
}

router.get('/', ensureRequest.isPermitted('contact:read'), function (req, res, next) {
  if (req.query.action === "export.csv") {
    ensureRequest.isPermitted('contact:export')(req, res, function() {
      csvExport(req, res, next);
    });
    return;
  }
  next();
}, async function(req, res, next) {
  var query = buildQuery(req), first = parseInt(req.query.first), size = parseInt(req.query.size);

  // Sanitize first.
  if (!first || first < 0 || size != req.query.previousSize) {
    first = 0;
  }
  if (!size || size <= 0) {
    size = 20;
  }
  console.log('Listing contacts');

  var data = {};

  try {
    data.contacts = await Contact.find(query)
    .populate({
      path: 'tags',
      options: { sort: 'name'}
    }).skip(first).limit(size + 1).exec();
  } catch(err) {
    next(err);
  }

  // Populate tags for search
  try {
    data.tags = await Tag.find().exec();
  } catch(err) {
    next(err);
  }

  var contacts = data.contacts;
  if (contacts.length > size) {
    contacts.pop();
    data.next = first + size;
    data.hasNext = true;
  }
  if (first >= size) {
    data.previous = first - size;
    data.hasPrevious = true;
  }
  if (data.hasPrevious || data.hasNext) {
    data.incomplete = true;
  }
  data.size = size;
  data.title = 'Liste de Contact';
  data.query = req.query;
  res.render('contacts/contactList', data);
});

router.get('/duplicates/', ensureRequest.isPermitted('contact:update'), async function(req, res, next) {
  /* find records with the same name */
  try {
    var c = await Contact.aggregate([
      {
        $group: {
          _id: {name: "$name"} ,
          ids: {$addToSet: "$_id"},
          count: {$sum: 1}
        }
      },
      {
        $match: {
          count: {$gt: 1}
        }
      }
    ]);
    res.render('contacts/contactDuplicates', { contacts: c });
  } catch(err) {
    next(err);
  }
});

router.get('/duplicates/:ids', ensureRequest.isPermitted('contact:update','contact:delete'), async function(req, res, next) {
  var ids = req.params.ids.split(',');
  var contacts = [];

  /* get all contacts from ids in route params & populate them with their tags */
  try {
    var contactsFromIds = await Contact.find({
      '_id': { $in: ids }
    }).populate({
      path: 'tags',
      options: { sort: 'name'}
    }).exec();
  } catch(err) {
    next(err);
  }

  /* create array withs contacts to display */
  for (var i = 0; i < contactsFromIds.length; i++) {
    var contactViewerObject = {
      contact: contactsFromIds[i]
    };
    var currentTagsIds = [];

    contactViewerObject.contact.tags.forEach(tag => { currentTagsIds.push(tag._id) });

    // Load other tags for edition
    try {
      contactViewerObject.tags = await Tag.find({ _id : { $nin : currentTagsIds }}).sort('name').exec();

      contacts.push(contactViewerObject);
    } catch(err) {
      next(err);
    }
  }
  res.render("contacts/chooseFromDuplicates", { contacts: contacts });
});

router.get('/edit/', ensureRequest.isPermitted('contact:create'), function (req, res, next) {
  res.render('contacts/contactEdit', { contact : {} });
});

router.get('/edit/:contactId', ensureRequest.isPermitted('contact:update'), async function (req, res, next) {
  console.log('Editing contact');
  var id = req.params.contactId;
  console.log('id :' + id);

  try {
    var contact = await Contact.findById(id).populate('tags').exec();

    res.render('contacts/contactEdit', {
      contact : contact
    });
  } catch(err) {
    next(err);
  }
});

router.get('/:contactId', ensureRequest.isPermitted('contact:read'), async function (req, res, next) {
  var id = req.params.contactId;
  console.log('Displaying contact ' + id);
  var contact, tags, data = {}, ids = [];

  try {
    contact = await Contact.findById(id);
  } catch(err) {
    next(err);
  }

  /* redirect to contact list if no contact found at this address*/
  if (contact === null) res.redirect('/contacts');

  try {
    contact = await Contact.populate(contact, {
      path: 'tags'
      , options: { sort: 'name'}
    });
  } catch(err) {
    next(err);
  }
  contact.tags.forEach(tag => { ids.push(tag._id) });

  // Load other tags for edition
  try {
    tags = await Tag.find({ _id : { $nin : ids }}).sort('name').exec();
  } catch(err) {
    next(err);
  }

  data.contact = contact;
  data.tags = tags;
  data.title = 'Fiche Contact ' + data.contact.fullName;
  res.render('contacts/contactView', data);
});

router.post('/', function (req, res, next) {
  // Wrap in a middleware as role to check depends on body.
  ensureRequest.isPermitted(req.body.id ? 'contact:update' : 'contact:create')(req, res, next);
}, async function (req, res, next) {
  console.log('Submitting contact ');
  var contact = null;
  var id = req.body.id;
  if (id) {
    try {
      contact = await Contact.findById(id).exec();
    } catch(err) {
      next(err);
    }
  } else {
    contact = new Contact();
  }

  contact.set({
    fullName : req.body.name,
    email : req.body.email,
    phone : req.body.phone,
    organization : req.body.organization,
    title : req.body.title,
    address : {
      number : req.body['address.number'],
      street : req.body['address.street'],
      code : req.body['address.code'],
      city : req.body['address.city']
    },
    note : req.body.note,
  });

  try {
    await contact.save();
    res.redirect(contact.id);
  } catch(err) {
    next(err);
  }
});

router.post('/:contactId/tags/', ensureRequest.isPermitted('contact:update'), async function (req, res, next) {
  var id = req.params.contactId
  , tag
  , tagId = req.body.tagId
  , backUrl = req.body.urlSource;
  console.log('Associating ' + id + ' with ' + tagId);

  try {
    tag = await Tag.findById(tagId).exec()
  } catch(err) {
    next(err);
  }

  if (tag == null) {
    console.log("Tag " + tagId + ' not found');
    next();
    return;
  }
  // Tag found at this point, add to tag set.

  try {
    await Contact.findByIdAndUpdate(id, {
      $addToSet : { tags : tag._id }
    }).exec();
  } catch(err) {
    next(err);
  }

  if (backUrl) {
    res.redirect(backUrl);
  }

  res.redirect("/contacts/" + id);
});

router.delete('/:contactId', ensureRequest.isPermitted('contact:delete'), async function (req, res, next) {
  var id = req.params.contactId
  , data;
  console.log('Removing ' + id);

  try {
    data = await Contact.findByIdAndRemove(id).exec();
  } catch(err) {
    next(err);
  }

  res.sendStatus(data ? 200 : 404);
});

router.delete('/:contactId/tags/:tagId', ensureRequest.isPermitted('contact:update'), async function (req, res, next) {
  var id = req.params.contactId
  , tagId = req.params.tagId
  , tag;
  console.log('Removing ' + id + ' with ' + tagId);

  try {
    tag = Tag.findById(tagId).exec();
  } catch (err) {
    next(err);
  }

  if (tag == null) {
    console.log("Tag " + tagId + ' not found');
    next();
    return;
  }

  try {
    await Contact.findByIdAndUpdate(id, {
      $pull : { tags : tag._id }
    }).exec();
  } catch(err) {
    next(err);
  }

  res.sendStatus(200);

});
