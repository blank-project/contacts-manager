var express = require('express')
  , router = express.Router()
  , Tag = require('../models/Tag');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/tags', router);
};

router.get('/', function (req, res, next) {
    console.log('Listing tags');
    var tags = Tag.find({}).sort('name').exec();
    tags.then(data => {
      res.render('tagList', {
        title : 'Liste d\'etiquettes',
        tags : data
      });
    });
});

router.get('/edit/', function (req, res, next) {
    res.render('tagEdit', { tag : {} });
});

router.get('/edit/:tagId', function (req, res, next) {
    console.log('Editing tag');
    var id = req.params.tagId;
    console.log('id :' + id);
    Tag.findById(id).exec().
    then(data => {
        res.render('tagEdit', {
          tag : data
        });
      }).
    catch(err => { next(err); });
});

router.post('/', function (req, res, next) {
    console.log('Submitting tag ');
    if (req.body.cancel) {
      // Redirect to list.
      res.redirect("");
      return;
    }
    var tag = null;
    var id = req.body.id;
    if (id) {
      tag = Tag.findById(id).exec();
    } else {
      tag = Promise.resolve(new Tag());
    }
    tag.then(tag => {
      if (!tag) {
        next();
        return;
      }
      tag.set({
        name : req.body.name,
        color : req.body.color
      });
      return tag.save();
    }).
    then(model => { res.redirect("") }).
    catch(err => { next(err); });
});
