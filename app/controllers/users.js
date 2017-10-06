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

    user = yield User.findById(id).exec();

    data.user = user;
    return data;
  }).then(data => {
    data.title = 'Profil ' + data.user.username;
    res.render('users/userView', data);
  }).catch(err => { next(err); });
}

router.route('/')
  .get(function (req, res, next) {
    console.log(req.user);
    console.log(req.session.user);
    res.redirect('/users/me');
  })
  .post(function (req, res, next) {
    console.log('Submitting User ');
    var user = new User();
    user.set({
      username : req.body.username,
      name : {
        first : req.body.firstname,
        last : req.body.lastname
      },
      email : req.body.email,
      phone : req.body.phone,
      organization : req.body.organization,
      title : req.body.title,
      meta : {
        // Disable self registration of user for now.
        disabled : new Date()
      }
    });
    User.register(user, req.body.password, function(err) {
      var data;
      if (err) {
        console.log(err);
        data = req.body || {};
        data.message = {
          level : 'error',
          message : err.message
        }
        res.render('users/userEdit', data);
        return;
      }

      console.log('user registered!');

      res.redirect('/');
    });
  });

router.get('/me', function (req, res, next) {
  var data = {
    user : req.user,
    title : 'Profil ' + req.user.username
  };
  res.render('users/userView', data);
});

router.get('/:userId', ensureLoggedIn('/login'), function (req, res, next) {
  var id = req.params.userId;
  userView(req, res, next, id);
});
