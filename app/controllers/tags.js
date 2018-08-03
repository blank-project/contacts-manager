var express = require('express')
  , router = express.Router()
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , Tag = require('../models/Tag')
  , TagManager = require('../business/TagManager');

var tagManager = new TagManager();

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/tags', ensureLoggedIn('/login'), router);
};

router.get('/edit/', function (req, res, next) {
    res.renderVue('tags/tagEdit', { tag : {} , title : 'Editer le tag'});
});

router.get('/edit/:tagId', function (req, res, next) {
    console.log('Editing tag');
    var id = req.params.tagId;
    console.log('id :' + id);
    Tag.findById(id).exec().
    then(data => {
        res.renderVue('tags/tagEdit', {
          tag : data , title : 'Editer le tag'
        });
      }).
    catch(err => { next(err); });
});

router.get('/', function (req, res, next) {
    console.log('Listing tags');
    var tags = Tag.find({}).sort('name').exec();
    tags.then(data => {
      res.renderVue('tags/tagList', {
        title : 'Liste d\'etiquettes',
        tags : data
      });
    });
});

router.get('/:tagId', function (req, res, next) {
    console.log('Showing tag');
    var id = req.params.tagId;
    console.log('id :' + id);
    Tag.findById(id).exec().
    then(data => {
        res.render('tags/tagView', {
          tag : data
        });
      }).
    catch(err => { next(err); });
});

router.post('/', function (req, res, next) {
    console.log('Submitting tag ');
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
    then(model => { res.redirect("/tags/") }).
    catch(err => { next(err); });
});



router.delete('/:tagId', function (req, res, next) {
  var id = req.params.tagId;
  console.log('id :' + id);
  tagManager.delete(id)
  .then((data) => {
      res.sendStatus(data ? 200 : 404);
  })
  .catch(err => {
      res.sendStatus(500);
  });

});
