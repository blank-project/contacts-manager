var express = require('express')
  , co = require('co')
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , ensureRequest = require('../../config/authorization').ensureRequest
  , router = express.Router()
  , User = require('../models/User')
  , Tag = require('../models/Tag');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/users', router);
};

function checkPasswordMatch(req, res, next) {
  if (req.body.password === req.body.passwordConfirm) {
      next();
      return;
  }
  data = req.body || {};
  data.message = {
    level : 'error',
    message : err.message
  }
  res.renderVue('users/userEdit', data);
}

async function userView(req, res, next, id) {
  console.log('Displaying user ' + id);

    var user, data = {};

    user = await User.findById(id).exec();
    data.user = user;
    data.title = 'Profil ' + data.user.username;
    res.render('users/userView', data);
}

router.get('/', function (req, res, next) {
  res.redirect('/users/me');
});

router.post('/', function (req, res, next) {
  if (!req.user && !req.body.id) {
    // Allow access for signup.
    next();
    return;
  }

  // If no signup, prevents unauthenticated access.
  if (!req.user) {
    res.redirect("/login");
  }

  if (req.body.id === req.user.id) {
    // Allow access for own edit.
    next();
    return;
  }

  // Wrap in a middleware as role to check depends on body.
  ensureRequest.isPermitted('user:update')(req, res, next);
}, checkPasswordMatch
 , async function (req, res, next) {
    console.log('Submitting User ');
    var user;
    var id = req.body.id;
    if (id) {
      user = await User.findById(id).exec();
      if (!user) {
        next();
        return;
      }
    } else {
      user = new User({
        username : req.body.username,
        meta : {
          // Disable self registration of user for now.
          disabled : new Date()
        }
      });
    }

    user.set({
      name : {
        first : req.body.firstname,
        last : req.body.lastname
      },
      email : req.body.email,
      phone : req.body.phone,
      organization : req.body.organization,
      title : req.body.title,
    });

    if (!id) {
      User.register(user, req.body.password, function(err) {
        if (err) {
          console.log(err);
          data = req.body || {};
          data.message = {
            level : 'error',
            message : err.message
          }
          res.renderVue('users/userCreate', data);
        } else {
          res.redirect('/');
        }
      });
    } else {
      await user.save();
      res.redirect('/users/me');
    }

  });

router.post('/edit/password', function (req, res, next) {
  var user = req.user;
  user.changePassword(req.body.passwordOld, req.body.password, function(err) {
    if (err) {
      console.log(err);
      data = req.body || {};
      data.user = user;
      data.message = {
        level : 'error',
        message : err.message
      }
      res.renderVue('users/userEdit', data);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/me', ensureLoggedIn('/login'), function (req, res, next) {
  var data = {
    title: 'Profil ' + req.user.username,
    user : req.user,
    username :req.user.username,
    email :req.user.email,
    phone :req.user.phone,
    organisation : req.user.organization,
    position : req.user.title,
    myId: req.user.id
  };
  res.renderVue('users/me', data, {
    data: {
      id: req.user.id
    }
  });
});

router.get('/edit/', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:create'), function (req, res, next) {
  res.renderVue('users/userCreate');
});

router.get('/edit/me', ensureLoggedIn('/login'), function (req, res, next) {
  res.renderVue('users/userEdit', { user : userdata(req.user) });
});

router.get('/edit/:userId', ensureLoggedIn('/login'), function (req, res, next) {

  if (req.params.userId === req.user.id) {
    // Allow access for own edit.
    next();
    return;
  }

  // Wrap in a middleware as role to check depends on body.
  ensureRequest.isPermitted('user:update')(req, res, next);
}, async function (req, res, next) {
  var id = req.params.userId;
  var user = await User.findById(id).exec();
  var dataUser = userdata(req.user);

  res.renderVue('users/userEdit', { user : dataUser });
});

router.get('/:userId', ensureLoggedIn('/login'), function (req, res, next) {
  var id = req.params.userId;
  userView(req, res, next, id);
});

function userdata(user) {
  var dataUser = user.toJSON();
  return dataUser;
}
