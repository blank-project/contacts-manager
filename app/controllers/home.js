var express = require('express'),
  router = express.Router(),
  auth = require('../../config/authentication');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.renderVue('home', {
      title : 'Contacts Manager'
    });
});

router.route('/login')
      .get(function (req, res, next) {
        var data =  {
          title : 'Login'
        }, flash = req.flash();
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
        successReturnToOrRedirect: '/contacts',
        successFlash: true,
        failureRedirect: '/login',
        failureFlash: true
      }));

router.get('/logout', function (req, res, next) {
    req.logout();
    delete res.locals.user;
    res.render('home/index', {
      title : 'Contacts Manager - Logout'
    });
});

router.route('/signup')
  .get(function (req, res, next) {
      res.renderVue('signup', {
        title : 'Sign Up'
      });
  });
