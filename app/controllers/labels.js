var express = require('express')
  , router = express.Router()
  , Label = require('../models/Label');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/labels', router);
};

router.get('/', function (req, res, next) {
    console.log('Listing labels');
    var labels = Label.find();
    labels.then(data => {
      res.render('labelList', {
        title : 'Liste d\'etiquettes',
        labels : data
      });
    });
});

router.get('/edit/', function (req, res, next) {
    res.render('labelEdit', { label : {} });
});

router.get('/edit/:labelId', function (req, res, next) {
    console.log('Editing label');
    var id = req.params.labelId;
    console.log('id :' + id);
    Label.findById(id).exec().
    then(data => {
        res.render('labelEdit', {
          label : data
        });
      }).
    catch(err => { next(err); });
});

router.post('/', function (req, res, next) {
    console.log('Submitting label ');
    if (req.body.cancel) {
      // Redirect to list.
      res.redirect("");
      return;
    }
    var label = null;
    var id = req.body.id;
    if (id) {
      label = Label.findById(id).exec();
    } else {
      label = Promise.resolve(new Label());
    }
    label.then(label => {
      if (!label) {
        next();
        return;
      }
      label.set({
        name : req.body.name,
        color : req.body.color
      });
      return label.save();
    }).
    then(model => { res.redirect("") }).
    catch(err => { next(err); });
});
