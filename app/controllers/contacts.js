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
    var query = {};
    if (req.query.tagId) {
      console.log(req.query.tagId);
      query.tags = { $all : req.query.tagId };
    }
    console.log('Listing contacts');

    co(function* () {
      return yield {
        contacts : Contact.find(query).populate({
          path: 'tags'
          , options: { sort: 'name'}
        }).exec(),
        tags : Tag.find().exec()
      };

    }).then(data => {
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
    if (req.body.cancel) {
      // Redirect to list.
      res.redirect("");
      return;
    }
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
