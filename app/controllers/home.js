var express = require('express'),
  router = express.Router(),
  auth = require('../../config/authentication');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  const user = req.user;
  if (user) {
     if (user.isPermitted('contact:read')) {
      res.redirect('/contacts/');
     } else {
       // Display own profile on home if not allowed to display contacts.
      res.redirect('/users/me');
     }
     
  } else {
    // Home page when not logged in
    res.renderVue('home', {
      title : 'Contacts Manager'
    });
  }    
});

router.route('/login')
      .get(function (req, res, next) {
        var data =  {
          title : 'Login'
        };
        var flash = req.flash();
        console.log(flash);
        if (flash && flash.error) {
          data.message = {
            level : 'error',
            message : flash.error[0]
          }
        }
        res.renderVue('login', data);
      })
      .post(auth.authenticate('local', {
        successReturnToOrRedirect: '/',
        successFlash: true,
        failureRedirect: '/login',
        failureFlash: true
      }));

router.get('/logout', function (req, res, next) {
    req.logout();
    delete res.locals.user;
    res.renderVue('home', {
      title : 'Contacts Manager - Logout',
      message : 'Déconnexion réussie'
    });
});

router.route('/signup')
  .get(function (req, res, next) {
      res.renderVue('signup', {
        title : 'Sign Up'
      });
  });
