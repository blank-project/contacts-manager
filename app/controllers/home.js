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
        title : 'Contacts Manager - Login'
      }, flash = req.flash();
      console.log(flash);
      if (flash && flash.error) {
        data.message = {
          level : 'error',
          message : flash.error[0]
        }
      }
      res.render('home/login', data);
  })
  .post(auth.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login',
    failureFlash: true
  }));

router.route('/login2')
      .get(function (req, res, next) {
        var data =  {
          title : 'Contacts Manager - Login'
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
        successRedirect: '/',
        failureRedirect: '/login2',
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
      res.render('users/userCreate', {
        title : 'Contacts Manager - Sign Up'
      });
  });
