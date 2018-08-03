var express = require('express')
, router = express.Router()
, ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
, ensureRequest = require('../../config/authorization').ensureRequest
, Contact = require('../models/Contact')
, Tag = require('../models/Tag')
, ContactManager = require('../business/ContactManager')
, ExportManager = require('../business/ExportManager');

// Instantiate and replace ContactManager;
ContactManager = new ContactManager();
// Instantiate and replace ExportManager;
ExportManager = new ExportManager();

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/contacts', ensureLoggedIn('/login'), router);
};

async function csvExport(req, res, next) {
  var query = req.query;
  const csvExport = await ExportManager.generateExport(query);

  res.download(csvExport.path, "contacts-exports.csv", function(err) {
    if (err) {
      console.log(err);
    }
    csvExport.remove();
  });
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
  var query = ContactManager.buildQuery(req.query), first = parseInt(req.query.first), size = parseInt(req.query.size);

  console.log('Listing contacts');
  //test de recup de la session id//
  console.log(req.sessionID);
  //test de recup du user (dans bdd)//
  console.log(req.user)

  var data = {
    user: {
      permissions: req.user.permissions,
      username: req.user.username
    }
  };

<<<<<<< HEAD
  var data = {}, options = { first, size };

  try {
    data.contacts = await ContactManager.find(req.query, options);
    // Get updated pagination values after sanitization.
    ({ first, size } = options);
  } catch(err) {
    next(err);
  }
=======
  res.locals = data;

  data.contacts = await Contact.find(query)
  .populate({
    path: 'tags',
    options: { sort: 'name'}
  }).skip(first).limit(size + 1);
>>>>>>> fix login & contacts page (WIP)

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
  res.renderVue('contacts/contactList', data);
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
  res.renderVue('contacts/contactEdit', { contact : { address: {}}, title : 'Editer contact' });
});

router.get('/edit/:contactId', ensureRequest.isPermitted('contact:update'), async function (req, res, next) {
  console.log('Editing contact');
  var id = req.params.contactId;
  console.log('id :' + id);

  try {
    var contact = await Contact.findById(id).populate('tags').exec();

    res.renderVue('contacts/contactEdit', {
      contact : contact,
      title : 'Editer contact'
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

  // Can not use contact directly, it causes a bug in Vueœ
  // Exports as a plain JSON Object
  data.contact = contact.toObject({ getters: true, virtuals: true });
  console.log(data.contact);
  data.tags = tags;
  data.title = 'Fiche Contact' + contact.fullName;

  console.log('Done loading contact for display ' + id);

  res.renderVue('contacts/contactView', data);
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
    return;
  }

  res.redirect("/contacts/" + id);
});

router.delete('/:contactId', ensureRequest.isPermitted('contact:delete'), async function (req, res, next) {
  var id = req.params.contactId, data;
  console.log('Removing ' + id);

  try {
    data = await Contact.findByIdAndRemove(id).exec();
    res.sendStatus(data ? 200 : 404);
    res.renderVue('contacts/contactView');
  } catch(err) {
    next(err);
  }
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
      $pull : { tags : tagId }
    }).exec();
  } catch(err) {
    next(err);
  }

  res.sendStatus(200);

});
