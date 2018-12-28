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
 * @param {*} req
 * @param {*} res
 * @param {*} next
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
 * Transforms the user to a DTO.
 * @param {User} user
 */
function userData(user) {
  return user ? user.toObject({ getters : true, virtuals : true}) : {};
}

/**
 *
 * @param {String} id the id of the user to load. If == 'me', loads the user from the request.
 * @param {*} req the request
 * @param {*} next the next middleware?
 */
async function loadUser(id, req, next) {
  if (id === req.user.id || id == 'me') {
    return req.user;
  }
  try {
    return await User.findById(id).exec();
  } catch(err) {
    next(err);
    return null;
  }
}

/**
 * Display list of user if allowed.
 */
router.get('/', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:read'), async function (req, res, next) {
  var first = parseInt(req.query.first), size = parseInt(req.query.size);
  var options = { first, size };

  try {
    var users = await UserManager.find(req.query, options);
   let data = {
     ...options,
     users,
     title : 'Liste de Contact'
    };

    res.renderVue('users/userList', data);
  } catch(err) {
    next(err);
    return;
  }

});

// DISPLAY
async function displayUser(id, req, res, next) {
  const user = await loadUser(id, req, next);
  if (user) {
    console.log('Displaying user ' + id);
    const data = {}
    data.user = userData(user);
    data.title = 'Profil : ' + data.user.username;
    res.renderVue('users/userView', data);
  }
}


/**
 * Diplay User Creation route.
 */
router.get('/edit/', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:create'), function (req, res, next) {
  const data = {}
  data.user = {
    name : {
      first : '',
      last : ''
    }
  };
  data.title = 'Créer un utilisateur';
  res.renderVue('users/userCreate', data);
});

/**
 * Display Self profile.
 */
router.get('/me', ensureLoggedIn('/login'), function (req, res, next) {
  displayUser('me', req, res, next);
});

/**
 * Display generic profile.
 */
router.get('/:userId', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:read'), function (req, res, next) {
  displayUser(req.params.userId, req, res, next);
});

// EDITION
async function editUser(id, req, res, next) {
  const user = await loadUser(id, req, next);
  if (user) {
    try {
      await UserManager.update(user, req.body);
      res.redirect('/users/' + id);
    } catch(e) {
      next(e);
      return;
    }
  }
}
/**
 * Edit Self route.
 */
router.post('/me/', ensureLoggedIn('/login'), function (req, res, next) {
  editUser('me', req, res, next);
});

/**
 * Edit User route.
 */
router.post('/:userId', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:update'), function (req, res, next) {
  const id = req.params.userId;
  editUser(id, req, res, next);
});

// CREATION

/**
 * Create User route.
 */
router.post('/', checkPasswordMatch, async function (req, res, next) {
  try {
    var created = await UserManager.create(req.body, req.user);
    if (created.meta.disabled) {
      console.log(`User ${created.username} was created disabled`);
      // TODO send flash message.
    }
    res.redirect('/users/me');
  } catch(e) {
    next(e);
    return;
  }
});

async function editUserPassword(id, req, res, next) {
  const user = await loadUser(id, req, next);
  if (user) {
    if (req.body.password !== req.body.passwordConfirm) {
      // Should be factor with displayEdit
      // TODO For all form we should handle error and forward to input with data already filled.
      const data = req.body;
      data.user = userData(user);
      data.title = 'Editer le Profil : ' + data.user.username;
      res.renderVue('users/userEdit', data);
      return;
    }
    try {
      await UserManager.updatePassword(user, req.body.passwordOld, req.body.password);
      res.redirect('/users/' + id);
    } catch(e) {
      next(e);
      return;
    }
  }
}

// PASSWORD EDITION

/**
 * Edit Self password.
 */
router.post('/me/password', ensureLoggedIn('/login'), function (req, res, next) {
  editUserPassword('me', req, res, next);
});

/**
 * Edit User password.
 */
router.post('/:userId/password', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:update'), function (req, res, next) {
    const id = req.params.userId;
    editUserPassword(id, req, res, next);
});

// DISPLAY EDITION


async function displayUserEdition(id, req, res, next) {
  const user = await loadUser(id, req, next);
  if (user) {
    const data = {}
    data.user = userData(user);
    data.title = 'Editer le Profil : ' + data.user.username;
    res.renderVue('users/userEdit', data);
  }
}

/**
 * Display Self edition
 */
router.get('/edit/me', ensureLoggedIn('/login'), function (req, res, next) {
  displayUserEdition('me', req, res, next);
});

/**
 * Display User edition
 */
router.get('/edit/:userId', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:update'), async function (req, res, next) {
  var id = req.params.userId;
  displayUserEdition(id, req, res, next);
});


// DISABLE (Ban/Unban)
async function disable(id, req, res, next) {
  const user = await loadUser(id, req, next);
  if (user) {
    user.ban(!!parseInt(req.body.disable));
    await user.save();
    res.redirect('/users/' + id);
  }
}

/**
 * Disables user
 */
router.post('/:userId/disable', ensureLoggedIn('/login'), ensureRequest.isPermitted('user:disable'), async function (req, res, next) {
    const id = req.params.userId;
    disable(id, req, res, next);
});

// UPDATE PERMISSIONS
/**
 * Update user permissions
 */
router.post('/:userId/permissions', ensureLoggedIn('/login'), ensureRequest.isPermitted('permission:update'), async function (req, res, next) {
    const id = req.params.userId;
    const user = await loadUser(id, req, next);
    if (user) {
      const permissions = req.body.permissions
        .split(";")
        // Does not allow a user to become admin.
        .filter(x => x != '*')
        .map(x => x.trim());

      user.permissions = permissions;
      await user.save();
      res.redirect('/users/' + id);
    }
});
