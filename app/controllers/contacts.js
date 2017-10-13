var express = require('express')
, co = require('co')
, router = express.Router()
, ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
, Contact = require('../models/Contact')
, Tag = require('../models/Tag');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/contacts', ensureLoggedIn('/login'), router);
};

router.get('/', async function (req, res, next) {
  var query = {}, first = parseInt(req.query.first), size = parseInt(req.query.size);
  // Search by all provided tags
  if (req.query.tagId) {
    query.tags = { $all : req.query.tagId };
  }
  if (req.query.search && req.query.search.trim()) {
    query.$text = { $search: req.query.search };
  }
  // Sanitize first.
  if (!first || first < 0 || size != req.query.previousSize) {
    first = 0;
  }
  if (!size || size <= 0) {
    size = 20;
  }
  console.log('Listing contacts');

  var data = {};
  data.contacts = await Contact.find(query)
  .populate({
    path: 'tags',
    options: { sort: 'name'}
  }).skip(first).limit(size + 1).exec();
  data.tags = await Tag.find().exec();

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
  res.render('contacts/contactList', data);
});

router.get('/edit/', function (req, res, next) {
  res.render('contacts/contactEdit', { contact : {} });
});

router.get('/edit/:contactId', async function (req, res, next) {
  console.log('Editing contact');
  var id = req.params.contactId;
  console.log('id :' + id);
  var contact = await Contact.findById(id).populate('tags').exec();

  res.render('contacts/contactEdit', {
    contact : contact
  });
});

router.get('/:contactId', async function (req, res, next) {
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

router.post('/', async function (req, res, next) {
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

router.post('/:contactId/tags/', async function (req, res, next) {
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

router.delete('/:contactId', async function (req, res, next) {
  var id = req.params.contactId;
  console.log('Removing ' + id);
  var data = await Contact.findByIdAndRemove(id).exec();
  res.sendStatus(data ? 200 : 404);
});

router.delete('/:contactId/tags/:tagId', async function (req, res, next) {
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
