var express = require('express')
  , router = express.Router()
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , ensureRequest = require('../../config/authorization').ensureRequest
  , Tag = require('../models/Tag')
  , TagManager = require('../business/TagManager');

var tagManager = new TagManager();

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/tags', ensureLoggedIn('/login'), router);
};

router.get('/edit/', async function (req, res, next) {
  res.renderVue('tags/tagEdit', {
    title : 'Créer un tag',
    tag : {}
  });
});

// Must have read permission to access the modify page, as data are displayed.
router.get('/edit/:tagId', ensureRequest.isPermitted('tag:read,update'), async function (req, res, next) {
  var id = req.params.tagId, tag;
  console.log('Editing tag ' + id);
  try {
    tag = await Tag.findById(id).exec();
  } catch(e) {
    next(e);
    return;
  }
  res.renderVue('tags/tagEdit', {
    title : 'Editer le tag ' + tag.name,
    tag : tag.toObject({virtuals : true})
  });
});

router.get('/', ensureRequest.isPermitted('tag:read'), async function (req, res, next) {
  var tags;
  try {
   tags = await Tag.find({}).sort('name').exec();
  } catch(e) {
    next(e);
    return;
  }
  tags = tags.map(tag => tag.toObject({virtuals : true}));

  res.renderVue('tags/tagList', {
    title : 'Liste d\'etiquettes',
    tags : tags
  });
});

router.get('/:tagId', ensureRequest.isPermitted('tag:read'), async function (req, res, next) {
    var id = req.params.tagId;
    console.log('Showing tag ' + id);
    try {
      var tag = await Tag.findById(id).exec();
      res.renderVue('tags/tagView', {
        tag : tag.toObject({virtuals : true})
      });
    } catch(err) {
      next(err);
      return;
    }
});

router.post('/', function (req, res, next) {
  // Wrap in a middleware as role to check depends on body.
  ensureRequest.isPermitted(req.body.id ? 'tag:update' : 'tag:create')(req, res, next);
}, function (req, res, next) {
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



router.delete('/:tagId', ensureRequest.isPermitted('tag:delete'), function (req, res, next) {
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
