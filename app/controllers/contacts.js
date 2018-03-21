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

  var data = {
  };
  
  data.contacts = await Contact.find(query)
  .populate({
    path: 'tags',
    options: { sort: 'name'}
  }).skip(first).limit(size + 1);

  // Populate tags for search
  data.tags = await Tag.find();

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
  res.renderVue('contacts/contactList', data);
});

router.get('/edit/', ensureRequest.isPermitted('contact:create'), function (req, res, next) {
  res.renderVue('contacts/contactEdit', { contact : { address: {}}, title : 'Editer contact' });
});

router.get('/edit/:contactId', ensureRequest.isPermitted('contact:update'), async function (req, res, next) {
  console.log('Editing contact');
  var id = req.params.contactId;
  console.log('id :' + id);
  var contact = await Contact.findById(id).populate('tags').exec();

  res.renderVue('contacts/contactEdit', {
    contact : contact,
    title : 'Editer contact'
  });
});

router.get('/:contactId', ensureRequest.isPermitted('contact:read'), async function (req, res, next) {
  var id = req.params.contactId;
  console.log('Displaying contact ' + id);
  var contact, tags, data = {}, ids = [];

  contact = await Contact.findById(id).populate({
    path: 'tags'
    , options: { sort: 'name'}
  }).exec();
  contact.tags.forEach(tag => { ids.push(tag._id) });

  // Load other tags for edition
  tags = await Tag.find({ _id : { $nin : ids }}).sort('name').exec();

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
    contact = await Contact.findById(id).exec();
    if (!contact) {
      next();
      return;
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
  await contact.save();
  res.redirect(contact.id);
});

router.post('/:contactId/tags/', ensureRequest.isPermitted('contact:update'), async function (req, res, next) {
  var id = req.params.contactId
  , tagId = req.body.tagId;
  console.log('Associating ' + id + ' with ' + tagId);
  var tag = await Tag.findById(tagId).exec()
  if (tag == null) {
    console.log("Tag " + tagId + ' not found');
    next();
    return;
  }
  // Tag found at this point, add to tag set.
  await Contact.findByIdAndUpdate(id, {
    $addToSet : { tags : tag._id }
  }).exec();

  res.redirect("/contacts/" + id);
});

router.delete('/:contactId', ensureRequest.isPermitted('contact:delete'), async function (req, res, next) {
  var id = req.params.contactId;
  console.log('Removing ' + id);
  var data = await Contact.findByIdAndRemove(id).exec();
  res.sendStatus(data ? 200 : 404);
});

router.delete('/:contactId/tags/:tagId', ensureRequest.isPermitted('contact:update'), async function (req, res, next) {
  var id = req.params.contactId
  , tagId = req.params.tagId;
  console.log('Removing ' + id + ' with ' + tagId);
  var tag = Tag.findById(tagId).exec();

  if (tag == null) {
    console.log("Tag " + tagId + ' not found');
    next();
    return;
  }

  await Contact.findByIdAndUpdate(id, {
    $pull : { tags : tag._id }
  }).exec();

  res.sendStatus(200);

});
