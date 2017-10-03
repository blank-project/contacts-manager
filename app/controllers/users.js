var express = require('express')
  , co = require('co')
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , router = express.Router()
  , User = require('../models/User')
  , Tag = require('../models/Tag');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/users', router);
};

function userView(req, res, next, id) {
  console.log('Displaying user ' + id);

  co(function* () {
    var user, data = {};

    user = yield user.findById(id).exec();

    data.user = user;
    return data;
  }).then(data => {
    data.title = 'Profil ' + data.user.username;
    res.render('users/userView', data);
  }).catch(err => { next(err); });
}

router.route('/')
  .get(function (req, res, next) {
    res.redirect('me');
  })
  .post(function (req, res, next) {
    console.log('Submitting User ');
    var user = new User();
    user.set({
      username : req.body.username,
      email : req.body.email,
      phone : req.body.phone,
      organization : req.body.organization,
      title : req.body.title,
      meta : {
        // Disable self registration of user for now.
        disabled : new Date()
      }
    });
    user.save().then(model => {
      res.redirect(model.id)
    })
    .catch(err => {
      next(err);
    });
  });

router.get('/:userId', ensureLoggedIn('/login'), function (req, res, next) {
  var id = req.params.userId;
  userView(id);
});

router.get('/me', function (req, res, next) {
  res.redirect(req.user._id);
});
