var express = require('express'),
  router = express.Router(),
  ContactDAO = require('../dao/ContactDAO');

module.exports = function (app) {
  app.use('/contacts', router);
};

router.get('/', function (req, res, next) {
    var contacts = ContactDAO.list();
    contacts.then(data => {
      res.render('contactList', {
        title : 'Liste de Contact',
        contacts : data
      });
    });
});

router.get('/edit/', function (req, res, next) {
    res.render('contactEdit');
});

router.get('/:contactId', function (req, res, next) {
    var id = req.params.contactId;
    console.log(id);
    var contacts = ContactDAO.load(id);
    contacts.then(data => {
      res.render('contactView', {
        title : 'Fiche Contact ' + data.name,
        contact : data
      });
    });
});

router.post('/', function (req, res, next) {
    var contact = {
      name : req.body.name,
      mail : req.body.mail
    };
    ContactDAO.save(contact).then(id => { res.redirect(id) }, err => {console.log(err);});
});
