var express = require('express')
  , co = require('co')
  , router = express.Router()
  , Contact = require('../models/Contact')
  , Tag = require('../models/Tag');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/contacts', router);
};

router.get('/', function (req, res, next) {
    var query = {}, first = parseInt(req.query.first), size = parseInt(req.query.size);
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

    co(function* () {
      return yield {
        contacts : Contact.find(query).populate({
          path: 'tags'
          , options: { sort: 'name'}
        }).skip(first).limit(size + 1).exec(),
        tags : Tag.find().exec()
      };

    }).then(data => {
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
      res.render('contactList', data);
    }).catch(err => { next(err); });
});

router.get('/edit/', function (req, res, next) {
    res.render('contactEdit', { contact : {} });
});

router.get('/edit/:contactId', function (req, res, next) {
    console.log('Editing contact');
    var id = req.params.contactId;
    console.log('id :' + id);
    Contact.findById(id).populate('tags').exec().
    then(data => {
        res.render('contactEdit', {
          contact : data
        });
    }).
    catch(err => { next(err); });
});

router.get('/:contactId', function (req, res, next) {
    var id = req.params.contactId;
    console.log('Displaying contact ' + id);

    co(function* () {
      var contact, tags, data = {}, ids = [];

      contact = yield Contact.findById(id).populate({
        path: 'tags'
        , options: { sort: 'name'}
      }).exec();
      contact.tags.forEach(tag => { ids.push(tag._id) });

      tags = yield Tag.find({ _id : { $nin : ids }}).sort('name').exec();

      data.contact = contact;
      data.tags = tags;
      return data;
    }).then(data => {
      data.title = 'Fiche Contact ' + data.contact.fullName;
      res.render('contactView', data);
    }).catch(err => { next(err); });
});

router.post('/', function (req, res, next) {
    console.log('Submitting contact ');
    var contact = null;
    var id = req.body.id;
    if (id) {
      contact = Contact.findById(id).exec();
    } else {
      contact = Promise.resolve(new Contact());
    }
    contact.then(contact => {
      if (!contact) {
        next();
        return;
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
      return contact.save();
    }).
    then(model => { res.redirect(model.id) }).
    catch(err => { next(err); });
});

router.post('/:contactId/tags/', function (req, res, next) {
    var id = req.params.contactId
      , tagId = req.body.tagId;
    console.log('Associating ' + id + ' with ' + tagId);
    Tag.findById(tagId).exec()
    .then(tag => {
      if (tag == null) {
        console.log("Tag " + tagId + ' not found');
        next();
        return;
      }
      // Tag found at this point, add to tag set.
      Contact.findByIdAndUpdate(id, {
        $addToSet : { tags : tag._id }
      }).exec()
      .then(() => {
          res.redirect("/contacts/" + id);
      })
      .catch(err => {
        next(err);
      });
    })
    .catch(err => { next(err); });

});

router.delete('/:contactId', function (req, res, next) {
    var id = req.params.contactId;
    console.log('Removing ' + id);
      // Tag found at this point, add to tag set.
      Contact.findByIdAndRemove(id).exec()
      .then((data) => {
          res.sendStatus(data ? 200 : 404);
      })
      .catch(err => {
          res.sendStatus(500);
      });
});

router.delete('/:contactId/tags/:tagId', function (req, res, next) {
    var id = req.params.contactId
      , tagId = req.params.tagId;
    console.log('Removing ' + id + ' with ' + tagId);
    Tag.findById(tagId).exec()
    .then(tag => {
      if (tag == null) {
        console.log("Tag " + tagId + ' not found');
        next();
        return;
      }
      // Tag found at this point, add to tag set.
      Contact.findByIdAndUpdate(id, {
        $pull : { tags : tag._id }
      }).exec()
      .then(() => {
          res.sendStatus(200);
      })
      .catch(err => {
        next(err);
      });
    })
    .catch(err => { next(err); });

});
