var express = require('express')
  , co = require('co')
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , ensureRequest = require('../../config/authorization').ensureRequest
  , router = express.Router()
  , User = require('../models/User')
  , UserManager = new (require('../business/UserManager'))
  , Tag = require('../models/Tag');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/users', router);
};

/**
 * Middleware for checking that the password match.
 * Calls the next middleware if 'req.body.password' and 'req.body.passwordConfirm' match.
 */
function checkPasswordMatch(req, res, next) {
  if (req.body.password === req.body.passwordConfirm) {
      next();
      return;
  }
  var data = req.body || {};
  data.message = {
    level : 'error',
    message : 'Les deux mots de passes sont différents'
  }
  res.renderVue('users/userEdit', data);
};

/**
 * Returns a Middleware for checking access to a given user.
 * Allows access to own user or if authenticated user has given permissions.
 */
function checkAccess(...permissions) {
  return function(req, res, next) {
    if (req.body.id === req.user.id) {
      // Allow access for own edit.
      next();
      return;
    }

    // Wrap in a middleware as role to check depends on body.
    ensureRequest.isPermitted(...permissions)(req, res, next);
  }
};

function userData(user) {
  return user ? user.toObject({ virtuals : true}) : {};
}

async function userView(req, res, next, id) {
  console.log('Displaying user ' + id);

    var user, data = {};

    user = await User.findById(id).exec();
    data.user = userData(user);
    data.title = 'Profil : ' + data.user.username;
    res.renderVue('users/userView', data);
}

/**
 * Display list of user if allowed.
 */
router.get('/', ensureRequest.isPermitted('user:read'), function (req, res, next) {
  // Not implemented.
  next(new Error('not available now'));
});

/**
 * Manages own profile.
 */
router.get('/me', ensureLoggedIn('/login'), function (req, res, next) {
  res.renderVue('users/me', userData(req.user));
});

router.get('/:userId', ensureRequest.isPermitted('user:read'), function (req, res, next) {
  var id = req.params.userId;
  userView(req, res, next, id);
});

/**
 * Create User route.
 */
router.post('/', async function (req, res, next) {
  try {
    var created = await UserManager.create(req.body, req.user);
    res.redirect('/users/me');
  } catch(e) {
    next(e);
    return;
  }
});

/**
 * Front `POST /` route.
 * Forward controls to next route if allowed.
 */
 /*
router.post('/', function (req, res, next) {
  if (!req.user && !req.body.id) {
    // Allow access for signup.
    next('route');
    return;
  }
  next();
},
ensureLoggedIn('/login'),
checkAccess('user:)
, checkPasswordMatch
 ,
*/
/**
 * Actual `POST /` route, called by previous one if and only if validation passes.
 */
 /*
router.post('/', async function (req, res, next) {
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
     try {
        user.save();
        res.redirect('/users/me');
     } catch(err) {
       next(err);
       return;
     }
   }

 });
 */

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

router.get('/edit/', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:create'), function (req, res, next) {
  res.renderVue('users/userCreate', { user: { username: req.user.username, permissions: req.user.permissions }});
});

router.get('/edit/me', ensureLoggedIn('/login'), function (req, res, next) {
  res.renderVue('users/userEdit', { user : userData(req.user) , title : 'Editer Profil' });
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
  var dataUser = userData(req.user);

  res.renderVue('users/userEdit', { user : dataUser });
});
