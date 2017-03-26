var express = require('express')
  , router = express.Router()
  , Contact = require('../models/Contact');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/contacts', router);
};

router.get('/', function (req, res, next) {
    console.log('Listing contacts');
    var contacts = Contact.find();
    contacts.then(data => {
      res.render('contactList', {
        title : 'Liste de Contact',
        contacts : data
      });
    });
});

router.get('/edit/', function (req, res, next) {
    res.render('contactEdit', { contact : {} });
});

router.get('/edit/:contactId', function (req, res, next) {
    console.log('Editing contact');
    var id = req.params.contactId;
    console.log('id :' + id);
    Contact.findById(id).exec().
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
    Contact.findById(id).exec().then(data => {
      if (data == null) {
        next();
        return;
      }

      res.render('contactView', {
        title : 'Fiche Contact ' + data.fullName,
        contact : data
      });

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
        phone : req.body.phone
      });
      return contact.save();
    }).
    then(model => { res.redirect(model.id) }).
    catch(err => { next(err); });
});
